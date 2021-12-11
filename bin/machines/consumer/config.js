"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    id: 'consumer',
    initial: 'ready',
    invoke: {
        id: 'kafka-consumer',
        src: 'kafkaConsumer',
    },
    states: {
        intializing: {
            on: {
                CONNECTED: {
                    target: 'ready',
                },
            },
        },
        ready: {
            entry: ['logReady'],
            invoke: [
                {
                    id: 'standard-input',
                    src: 'standardInput',
                },
            ],
            on: {
                SUBSCRIBE: {
                    actions: ['sendInputToConsumer'],
                },
                SEND: {
                    actions: ['sendInputToConsumer'],
                },
                SENT: {
                    actions: [],
                },
            },
        },
    },
};
exports.default = config;
