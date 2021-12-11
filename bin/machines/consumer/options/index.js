"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = __importDefault(require("./actions"));
var services_1 = __importDefault(require("./services"));
exports.default = {
    actions: actions_1.default,
    services: services_1.default,
};
