"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ACCEPT = void 0;
const icons_1 = require("@sanity/icons");
exports.DEFAULT_ACCEPT = [
    'video/*',
    'audio/*',
    'application/pdf'
];
const config = {
    id: 's3-dam',
    customDataFieldName: 's3',
    defaultAccept: exports.DEFAULT_ACCEPT,
    toolTitle: 'Upload to s3',
    credentialsFields: [
        {
            name: 'bucketKey',
            title: 'S3 bucket key',
            icon: icons_1.LockIcon,
            type: 'string',
            validation: Rule => Rule.required(),
        },
        {
            name: 'bucketRegion',
            title: 'S3 bucket region',
            icon: icons_1.EarthGlobeIcon,
            type: 'string',
            validation: Rule => Rule.required(),
        },
        {
            name: 'getSignedUrlEndpoint',
            title: "Endpoint for getting S3's signed URL",
            icon: icons_1.PinIcon,
            type: 'url',
            validation: Rule => Rule.required(),
        },
        {
            name: 'deleteObjectEndpoint',
            title: 'Endpoint for deleting an object in S3',
            icon: icons_1.TrashIcon,
            type: 'url',
            validation: Rule => Rule.required(),
        },
        {
            name: 'secretForValidating',
            title: 'Secret for validating the signed URL request (optional)',
            icon: icons_1.EyeClosedIcon,
            type: 'string',
        },
    ],
    deleteFile: ({ storedFile, credentials }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!credentials || typeof credentials.deleteObjectEndpoint !== 'string') {
            return 'missing-credentials';
        }
        const endpoint = credentials.deleteObjectEndpoint;
        try {
            const res = yield fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    fileKey: (_a = storedFile.s3) === null || _a === void 0 ? void 0 : _a.key,
                    secret: credentials.secretForValidating,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log({ res });
            if (res.ok) {
                return true;
            }
            else {
                return 'error';
            }
        }
        catch (error) {
            return (error === null || error === void 0 ? void 0 : error.message) || 'error';
        }
    }),
    uploadFile: ({ credentials, onError, onSuccess, file, fileName, documentType }) => {
        if (!credentials ||
            typeof credentials.getSignedUrlEndpoint !== 'string' ||
            typeof credentials.bucketKey !== 'string') {
            onError({
                name: 'missing-credentials',
                message: 'Missing correct credentials',
            });
        }
        // On cancelling fetch: https://davidwalsh.name/cancel-fetch
        let signal;
        let controller;
        try {
            controller = new AbortController();
            signal = controller.signal;
        }
        catch (error) { }
        const endpoint = credentials.getSignedUrlEndpoint;
        fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                fileName,
                contentType: file.type,
                secret: credentials.secretForValidating,
                documentType: documentType,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            signal,
        })
            .then((response) => response.json())
            .then(({ url, fields }) => {
            const fileKey = (fields === null || fields === void 0 ? void 0 : fields.key) || fileName;
            const data = Object.assign(Object.assign({ bucket: credentials.bucketKey }, fields), { 'Content-Type': file.type, file });
            const formData = new FormData();
            for (const name in data) {
                formData.append(name, data[name]);
            }
            fetch(url, {
                method: 'POST',
                body: formData,
                mode: 'cors',
                signal,
            })
                .then((res) => {
                if (res.ok) {
                    onSuccess({
                        fileURL: `https://s3.${credentials.bucketRegion}.amazonaws.com/${credentials.bucketKey}/${fileKey}`,
                        s3: {
                            key: fileKey,
                            bucket: credentials.bucketKey,
                            region: credentials.bucketRegion,
                        },
                    });
                }
                else {
                    console.log({
                        objectPostFaultyResponse: res,
                    });
                    onError({
                        message: 'Ask your developer to check AWS permissions.',
                        name: 'failed-presigned',
                    });
                }
            })
                .catch((error) => {
                console.log({ objectPostError: error });
                onError(error);
            });
        })
            .catch((error) => {
            console.log({ presignedUrlFailure: error });
            onError(error);
        });
        return () => {
            try {
                if (controller === null || controller === void 0 ? void 0 : controller.abort) {
                    controller.abort();
                }
            }
            catch (error) { }
        };
    },
};
exports.default = config;
