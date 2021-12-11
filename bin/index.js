#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var uuid_1 = require("uuid");
var program = new commander_1.Command();
program
    .command('admin')
    .option('-i, --id <id>', 'Kafka Consumer Id')
    .requiredOption('-b, --brokers <brokers>')
    .description('Kafka Admin Client')
    .action(function (opts) {
    require(__dirname + '/programs/admin')(opts);
});
program
    .command('producer')
    .option('-i, --id <id>', 'Kafka Consumer Id')
    .requiredOption('-b, --brokers <brokers>')
    .requiredOption('-t, --topic <topic>', 'Kafka topic to produce into.')
    .description('Kafka Producer Client')
    .action(function (opts) {
    require(__dirname + '/programs/producer')(opts);
});
program
    .command('consumer')
    .option('-i, --id <id>', 'Kafka Consumer Id')
    .requiredOption('-g, --group <group_id>', 'Kafka Consumer Group')
    .requiredOption('-b, --brokers <brokers>')
    .requiredOption('-t, --topic <topic>', 'Kafka topic to consume from.')
    .description('Kafka Consumer Client')
    .action(function (opts) {
    if (!opts.id)
        opts.id = (0, uuid_1.v4)();
    require(__dirname + '/programs/consumer')(opts);
});
program.parse(process.argv);
