"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sanity_plugin_external_dam_1 = require("sanity-plugin-external-dam");
const config_1 = __importDefault(require("./config"));
const Tool_1 = __importDefault(require("./components/Tool"));
exports.default = {
    name: 's3-dam',
    title: config_1.default.toolTitle,
    component: Tool_1.default,
    icon: sanity_plugin_external_dam_1.ToolIcon,
};
