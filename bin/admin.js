"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var program = new commander_1.Command();
program
    .option('-b, --brokers', 'Kafka BrokerList')
    .option('-d, --debug', 'Debug Mode');
program.parse(process.argv);
var options = program.opts();
if (options.debug)
    console.log(options);
var _a = program.opts();
console.log('pizza details:');
if (options.small)
    console.log('- small pizza size');
if (options.pizzaType)
    console.log("- ".concat(options.pizzaType));
