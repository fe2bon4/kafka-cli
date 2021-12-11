"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin_1 = require("../machines/admin");
module.exports = function (options) {
    var service = (0, admin_1.Interpret)({
        params: options,
    });
    service.start();
};
