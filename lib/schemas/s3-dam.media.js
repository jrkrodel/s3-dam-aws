"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Input_1 = __importDefault(require("../components/Input"));
exports.default = {
    name: 's3-dam.media',
    title: 'S3 media',
    type: 'object',
    inputComponent: Input_1.default,
    fields: [
        {
            name: 'asset',
            title: 'Asset',
            type: 'reference',
            to: [{ type: 's3-dam.storedFile' }],
        },
    ],
};
