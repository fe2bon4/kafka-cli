"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var consumer_1 = require("../machines/consumer");
module.exports = function (options) {
    var service = (0, consumer_1.Interpret)({
        params: options,
    });
    service.start();
};
