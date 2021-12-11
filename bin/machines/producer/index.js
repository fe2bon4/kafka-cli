"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpret = exports.spawn = void 0;
var xstate_1 = require("xstate");
var cli_1 = require("../../utils/cli");
var config_1 = __importDefault(require("./config"));
var options_1 = __importDefault(require("./options"));
var spawn = function (context) {
    return (0, xstate_1.createMachine)(__assign(__assign({}, config_1.default), { context: __assign(__assign({}, context), { log: (0, cli_1.prefixLog)('producer') }) }), options_1.default);
};
exports.spawn = spawn;
var Interpret = function (context, start) {
    if (start === void 0) { start = false; }
    var machine = (0, exports.spawn)(context);
    var instance = (0, xstate_1.interpret)(machine);
    if (!start)
        return instance;
    instance.start();
    return instance;
};
exports.Interpret = Interpret;
__exportStar(require("./types"), exports);
