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
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var actions = {
    logReady: function () {
        console.log("Kafka Client is ready.");
    },
    sendCommandToClient: (0, xstate_1.send)(function (_, e) { return e; }, {
        to: 'kafka-client',
    }),
    updateParams: (0, xstate_1.assign)({
        params: function (_a, _b) {
            var params = _a.params;
            var payload = _b.payload;
            return __assign(__assign({}, params), payload);
        },
    }),
};
exports.default = actions;
