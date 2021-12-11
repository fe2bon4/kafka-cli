"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    id: 'admin',
    initial: 'intializing',
    invoke: {
        id: 'kafka-client',
        src: 'kafkaClient',
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
                '*': {
                    actions: ['sendCommandToClient'],
                },
            },
        },
    },
};
exports.default = config;
