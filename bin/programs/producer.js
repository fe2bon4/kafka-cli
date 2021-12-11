"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var producer_1 = require("../machines/producer");
module.exports = function (options) {
    var service = (0, producer_1.Interpret)({
        params: options,
    });
    service.start();
};
