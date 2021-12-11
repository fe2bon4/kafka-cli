"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
var createLogger = function (log) {
    return function (logLevel) {
        return function (_a) {
            var label = _a.label, namespace = _a.namespace, level = _a.level, logObj = _a.log;
            if (level > logLevel)
                return;
            log("[namespace:".concat(namespace, "][").concat(label, "]"), logObj.message);
        };
    };
};
exports.createLogger = createLogger;
