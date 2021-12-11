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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var kafkajs_1 = require("kafkajs");
var commander_1 = require("commander");
var cli_1 = require("../../../utils/cli");
var kafkajs_2 = require("../../../utils/kafkajs");
var toWinstonLogLevel = function (level) {
    switch (level) {
        case kafkajs_1.logLevel.ERROR:
        case kafkajs_1.logLevel.NOTHING:
            return 'error';
        case kafkajs_1.logLevel.WARN:
            return 'warn';
        case kafkajs_1.logLevel.INFO:
            return 'info';
        case kafkajs_1.logLevel.DEBUG:
            return 'debug';
    }
};
var services = {
    kafkaConsumer: function (_a) {
        var params = _a.params, log = _a.log;
        return function (send, onEvent) {
            var kafka = new kafkajs_1.Kafka({
                clientId: params.id,
                brokers: params.brokers.split(','),
                logLevel: kafkajs_1.logLevel.ERROR,
                logCreator: (0, kafkajs_2.createLogger)(log),
            });
            var consumer = kafka.consumer({
                sessionTimeout: 10000,
                heartbeatInterval: 2000,
                groupId: params.group,
            });
            var _a = consumer.events, GROUP_JOIN = _a.GROUP_JOIN, CONNECT = _a.CONNECT;
            consumer.on(GROUP_JOIN, function () {
                send('CONNECTED');
            });
            consumer.on(CONNECT, function () { });
            var onEachMessage = function (_a) {
                var topic = _a.topic, message = _a.message, partition = _a.partition;
                return __awaiter(void 0, void 0, void 0, function () {
                    var _b;
                    return __generator(this, function (_c) {
                        log('Got Message', "\n[topic:".concat(topic, "][partition:").concat(partition, "]"), (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString());
                        return [2 /*return*/];
                    });
                });
            };
            consumer.connect().then(function () {
                consumer.subscribe({ topic: params.topic });
                consumer.run({
                    eachMessage: onEachMessage,
                });
            });
            onEvent(function (event) {
                switch (event.type) {
                    case 'SEND': {
                        console.log(event);
                        break;
                    }
                    case 'SUBSCRIBE': {
                        consumer.subscribe(__assign({}, event.payload));
                        break;
                    }
                    case 'SEEK': {
                        consumer.seek(__assign({}, event.payload));
                        break;
                    }
                    case 'START': {
                        consumer
                            .run({
                            eachMessage: onEachMessage,
                        })
                            .then(function () { return log('Consumer is now running'); });
                        break;
                    }
                    case 'STOP': {
                        consumer.stop().then(function () { return log("Consumer has stopped"); });
                        break;
                    }
                    case 'CONNECTED': {
                        log('Consumer has reconnected');
                        break;
                    }
                    default:
                        log('@Consumer', event);
                        break;
                }
            });
        };
    },
    standardInput: function (_a) {
        var log = _a.log;
        return function (send) {
            var commander = new commander_1.Command();
            commander
                .command('send')
                .description('Send Input to Consumer Service')
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
                .command('start')
                .description('Start this consumer')
                .action(function () {
                send({
                    type: 'START',
                    payload: {},
                });
            });
            commander
                .command('stop')
                .description('Stop this consumer')
                .action(function () {
                send({
                    type: 'STOP',
                    payload: {},
                });
            });
            commander
                .command('subscribe')
                .description('Subscribe to topic')
                .argument('[topic]')
                .option('-b, --beginning', 'Subscribe from beginning', false)
                .action(function (topic, _a) {
                var beginning = _a.beginning;
                if (!topic) {
                    return log("Subscribe [topic], topic is required");
                }
                send({
                    type: 'SUBSCRIBE',
                    payload: {
                        topic: topic,
                        fromBeginning: beginning,
                    },
                });
            });
            commander
                .command('seek')
                .description('Seek topic offset')
                .argument('[topic]')
                .option('-o, --offset [offset]', 'Index to set the seek offset', parseInt)
                .option('-p, --partition [partition]', 'Partition of the topic', parseInt)
                .action(function (topic, _a) {
                var offset = _a.offset, _b = _a.partition, partition = _b === void 0 ? 0 : _b;
                if (!topic) {
                    return console.error("subscribe [topic], topic is required");
                }
                if (isNaN(offset)) {
                    return console.error("-o|--offset [offset], offset is required");
                }
                if (partition < 0) {
                    return console.error("-p|--partition [partition], partition cannot be less than 0");
                }
                send({
                    type: 'SEEK',
                    payload: {
                        topic: topic,
                        offset: offset,
                        partition: partition,
                    },
                });
            });
            var _a = (0, cli_1.createCli)(commander, 'consumer'), cleanup = _a.cleanup, pause = _a.pause, resume = _a.resume, prompt = _a.prompt;
            return cleanup;
        };
    },
};
exports.default = services;
