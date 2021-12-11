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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var actions = {
    logReady: function () {
        console.log("Kafka Consumer is ready.");
    },
    sendInputToConsumer: (0, xstate_1.send)(function (_a, _b) {
        var params = _a.params;
        var payload = _b.payload, rest = __rest(_b, ["payload"]);
        return (__assign(__assign({}, rest), { payload: __assign({ topic: params.topic }, payload) }));
    }, {
        to: 'kafka-consumer',
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
