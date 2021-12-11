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
var kafkajs_1 = require("kafkajs");
var commander_1 = require("commander");
var cli_1 = require("../../../utils/cli");
var kafkajs_2 = require("../../../utils/kafkajs");
var services = {
    kafkaProducer: function (_a) {
        var params = _a.params, log = _a.log;
        return function (send, onEvent) {
            var kafka = new kafkajs_1.Kafka({
                clientId: params.id,
                brokers: params.brokers.split(','),
                logCreator: (0, kafkajs_2.createLogger)(log),
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
    standardInput: function (_a) {
        var log = _a.log, params = _a.params;
        return function (send, onEvent) {
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
                pause();
            });
            commander
                .command('change-topic')
                .description('Change the current topic')
                .argument('[topic]')
                .action(function (topic) {
                if (!topic) {
                    return log("change-topic [topic], topic is required");
                }
                send({
                    type: 'CHANGE_TOPIC',
                    payload: {
                        topic: topic,
                    },
                });
            });
            var _a = (0, cli_1.createCli)(commander, 'producer'), cleanup = _a.cleanup, pause = _a.pause, resume = _a.resume;
            log("Current Topic:", params.topic);
            onEvent(function (e) {
                switch (e.type) {
                    case 'SENT':
                        resume();
                        break;
                    default:
                        log(e);
                        break;
                }
            });
            return cleanup;
        };
    },
};
exports.default = services;
