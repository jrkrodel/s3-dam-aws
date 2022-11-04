"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const sanity_plugin_external_dam_1 = require("sanity-plugin-external-dam");
const config_1 = __importDefault(require("../config"));
const Tool = () => react_1.default.createElement(sanity_plugin_external_dam_1.StudioTool, Object.assign({}, config_1.default));
exports.default = Tool;
