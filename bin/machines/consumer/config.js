"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    id: 'consumer',
    initial: 'intializing',
    invoke: {
        id: 'kafka-consumer',
        src: 'kafkaConsumer',
    },
    states: {
        intializing: {
            entry: 'logInitializing',
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
                '*': {
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
