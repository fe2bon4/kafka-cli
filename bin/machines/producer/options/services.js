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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var kafkajs_1 = require("kafkajs");
var commander_1 = require("commander");
var services = {
    kafkaProducer: function (_a) {
        var params = _a.params;
        return function (send, onEvent) {
            var kafka = new kafkajs_1.Kafka({
                clientId: params.id,
                brokers: params.brokers.split(','),
            });
            var producer = kafka.producer({
                allowAutoTopicCreation: true,
            });
            producer.connect().then(function () {
                send('CONNECTED');
            });
            onEvent(function (event) {
                switch (event.type) {
                    case 'SEND': {
                        producer
                            .send({
                            topic: event.payload.topic,
                            messages: [
                                {
                                    value: event.payload.message,
                                },
                            ],
                        })
                            .then(function (meta) {
                            send({
                                type: 'SENT',
                                payload: __assign({}, event.payload),
                            });
                        });
                        break;
                    }
                    default:
                        break;
                }
            });
        };
    },
    standardInput: function () { return function (send) {
        var commander = new commander_1.Command();
        commander
            .command('send')
            .description('Send Text to Topic')
            .argument('[messages...]')
            .action(function (messages) {
            if (!messages.length)
                return;
            send({
                type: 'SEND',
                payload: {
                    message: messages.join(' '),
                },
            });
        });
        commander
            .command('change-topic')
            .description('Change the current topic')
            .argument('[topic]')
            .action(function (topic) {
            if (!topic) {
                return console.error("change-topic [topic], topic is required");
            }
            send({
                type: 'CHANGE_TOPIC',
                payload: {
                    topic: topic,
                },
            });
        });
        commander.exitOverride();
        commander.outputHelp();
        var onInput = function (buffer) {
            var input = buffer.toString().replace(/\n/g, '');
            if (!input)
                return;
            var argv = __spreadArray(['', ''], input.split(' '), true);
            try {
                commander.parse(argv);
            }
            catch (e) {
                if (e.exitCode === 0)
                    return;
            }
        };
        process.stdin.on('data', onInput);
        return function () {
            process.stdin.off('data', onInput);
        };
    }; },
};
exports.default = services;
