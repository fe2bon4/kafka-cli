"use strict";
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
    kafkaConsumer: function (_a) {
        var params = _a.params;
        return function (send, onEvent) {
            console.log(params);
            var kafka = new kafkajs_1.Kafka({
                clientId: params.id,
                brokers: params.brokers.split(','),
            });
            var consumer = kafka.consumer({
                groupId: params.group,
            });
            consumer.connect().then(function () {
                send('CONNECTED');
                consumer.subscribe({ topic: params.topic });
                consumer.run({
                    eachMessage: function (_a) {
                        var topic = _a.topic, message = _a.message;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var date;
                            var _b;
                            return __generator(this, function (_c) {
                                date = new Date();
                                console.log("[".concat(date.toLocaleString(), "][topic:").concat(topic, "]"), (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString());
                                return [2 /*return*/];
                            });
                        });
                    },
                });
            });
            onEvent(function (event) {
                switch (event.type) {
                    case 'SEND': {
                        console.log(event);
                        break;
                    }
                    case 'SUBSCRIBE': {
                        consumer.subscribe({ topic: event.payload.topic });
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
            .command('subscribe')
            .description('subscribe to topic')
            .argument('[topic]')
            .action(function (topic) {
            if (!topic) {
                return console.error("subscribe [topic], topic is required");
            }
            send({
                type: 'SUBSCRIBE',
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
