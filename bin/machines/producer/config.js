"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    id: 'producer',
    initial: 'ready',
    invoke: {
        id: 'kafka-producer',
        src: 'kafkaProducer',
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
                CHANGE_TOPIC: {
                    actions: ['updateParams'],
                },
                SEND: {
                    actions: ['sendInputToProducer'],
                },
            },
        },
    },
};
exports.default = config;
