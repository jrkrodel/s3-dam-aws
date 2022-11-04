"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sanity_plugin_external_dam_1 = require("sanity-plugin-external-dam");
const config_1 = __importDefault(require("../config"));
const schema_config_1 = __importDefault(require("../schema.config"));
exports.default = (0, sanity_plugin_external_dam_1.getStoredFileSchema)(config_1.default, schema_config_1.default);
