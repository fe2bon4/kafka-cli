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
Object.defineProperty(exports, "__esModule", { value: true });
var kafkajs_1 = require("kafkajs");
var commander_1 = require("commander");
var cli_1 = require("../../../utils/cli");
var kafkajs_2 = require("../../../utils/kafkajs");
var services = {
    kafkaClient: function (_a) {
        var params = _a.params, log = _a.log;
        return function (send, onEvent) {
            var kafka = new kafkajs_1.Kafka({
                clientId: params.id,
                brokers: params.brokers.split(','),
                logCreator: (0, kafkajs_2.createLogger)(log),
            });
            var admin = kafka.admin();
            admin.connect().then(function () {
                send('CONNECTED');
            });
            onEvent(function (event) { return __awaiter(void 0, void 0, void 0, function () {
                var _a, topics, created, updated, result, groups, cluster, groupInfo, topicsInfo, e_1, date;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 22, , 23]);
                            _a = event.type;
                            switch (_a) {
                                case 'COMMAND': return [3 /*break*/, 1];
                                case 'LIST_TOPICS': return [3 /*break*/, 2];
                                case 'CREATE_TOPICS': return [3 /*break*/, 4];
                                case 'CREATE_PARTITIONS': return [3 /*break*/, 6];
                                case 'FETCH_OFFSETS_TOPIC': return [3 /*break*/, 8];
                                case 'DELETE TOPICS': return [3 /*break*/, 10];
                                case 'LIST_GROUPS': return [3 /*break*/, 12];
                                case 'DESCRIBE_CLUSTER': return [3 /*break*/, 14];
                                case 'DESCRIBE_GROUPS': return [3 /*break*/, 16];
                                case 'DESCRIBE_TOPICS': return [3 /*break*/, 18];
                            }
                            return [3 /*break*/, 20];
                        case 1:
                            {
                                return [3 /*break*/, 21];
                            }
                            _b.label = 2;
                        case 2: return [4 /*yield*/, admin.listTopics()];
                        case 3:
                            topics = _b.sent();
                            log("[list-topics]", JSON.stringify(topics, null, 4));
                            return [3 /*break*/, 21];
                        case 4: return [4 /*yield*/, admin.createTopics({
                                waitForLeaders: false,
                                topics: event.payload.topics,
                            })];
                        case 5:
                            created = _b.sent();
                            log("[created:".concat(created, "]"), event.payload.topics.map(function (_a) {
                                var topic = _a.topic;
                                return topic;
                            }));
                            return [3 /*break*/, 21];
                        case 6: return [4 /*yield*/, admin.createPartitions({
                                topicPartitions: [event.payload],
                            })];
                        case 7:
                            updated = _b.sent();
                            log("[updated:".concat(updated, "][topic:").concat(event.payload.topic, "][partitions:").concat(event.payload.count, "]"));
                            return [3 /*break*/, 21];
                        case 8: return [4 /*yield*/, admin.fetchTopicOffsets(event.payload.topic)];
                        case 9:
                            result = _b.sent();
                            log('[fetch-topic-offsets]', result);
                            _b.label = 10;
                        case 10: return [4 /*yield*/, admin
                                .deleteTopics({
                                topics: event.payload.topics,
                            })
                                .then(function () {
                                log("[deleted:true]", event.payload.topics.map(function (_a) {
                                    var topic = _a.topic;
                                    return topic;
                                }));
                            })
                                .catch(function (e) {
                                log("[deleted:false]", event.payload.topics.map(function (_a) {
                                    var topic = _a.topic;
                                    return topic;
                                }), e);
                            })];
                        case 11:
                            _b.sent();
                            return [3 /*break*/, 21];
                        case 12: return [4 /*yield*/, admin.listGroups()];
                        case 13:
                            groups = _b.sent();
                            log("[list-groups]", JSON.stringify(groups, null, 4));
                            return [3 /*break*/, 21];
                        case 14: return [4 /*yield*/, admin.describeCluster()];
                        case 15:
                            cluster = _b.sent();
                            log("[describe-cluster]", JSON.stringify(cluster, null, 4));
                            return [3 /*break*/, 21];
                        case 16: return [4 /*yield*/, admin.describeGroups([
                                event.payload.groups,
                            ])];
                        case 17:
                            groupInfo = _b.sent();
                            log("[describe-groups]", JSON.stringify(groupInfo, null, 4));
                            return [3 /*break*/, 21];
                        case 18: return [4 /*yield*/, admin.fetchTopicMetadata({
                                topics: event.payload.topics,
                            })];
                        case 19:
                            topicsInfo = _b.sent();
                            log("[describe-topics]", JSON.stringify(topicsInfo, null, 4));
                            return [3 /*break*/, 21];
                        case 20:
                            console.log(event);
                            return [3 /*break*/, 21];
                        case 21: return [3 /*break*/, 23];
                        case 22:
                            e_1 = _b.sent();
                            date = new Date();
                            console.log("[".concat(date.toLocaleString(), "][error]"), e_1.message);
                            return [3 /*break*/, 23];
                        case 23: return [2 /*return*/];
                    }
                });
            }); });
        };
    },
    standardInput: function () { return function (send) {
        var commander = new commander_1.Command();
        commander
            .command('list-groups')
            .description('List Consumer Groups in this cluster')
            .action(function () {
            send({
                type: 'LIST_GROUPS',
                payload: {},
            });
        });
        commander
            .command('list-topics')
            .description('List topics on this cluster')
            .action(function () {
            send({
                type: 'LIST_TOPICS',
                payload: {},
            });
        });
        commander
            .command('create-topics')
            .description('Create topics on this cluster')
            .argument('[topics...]', 'Topics to be created')
            .option('-p, --partitions [partitions]', 'Number of partitions for each created topic', parseInt)
            .option('-r, --replicas [replica]', 'Number of replicas for each created topic', parseInt)
            .action(function (topics, _a) {
            var _b = _a.partitions, partitions = _b === void 0 ? 1 : _b, _c = _a.replicas, replicas = _c === void 0 ? 1 : _c;
            var topicConfigs = topics.map(function (topic) {
                return {
                    topic: topic,
                    numPartitions: partitions,
                    replicationFactor: replicas,
                };
            });
            send({
                type: 'CREATE_TOPICS',
                payload: {
                    topics: topicConfigs,
                },
            });
        });
        commander
            .command('create-partitions')
            .description('Create topics on this cluster')
            .argument('[topics]', 'Topics to be partitioned')
            .option('-p, --partitions [partitions]', 'Number of partitions for topic', parseInt)
            .action(function (topic, _a) {
            var _b = _a.partitions, partitions = _b === void 0 ? 1 : _b;
            console.log(topic, partitions);
            var payload = {
                count: partitions,
                topic: topic,
            };
            send({
                type: 'CREATE_PARTITIONS',
                payload: payload,
            });
        });
        commander
            .command('fetch-topic-offsets')
            .description('Fetch Offsets of each partition in topic')
            .argument('[topic]', 'Topic')
            .action(function (topic) {
            send({
                type: 'FETCH_OFFSETS_TOPIC',
                payload: {
                    topic: topic,
                },
            });
        });
        commander
            .command('delete-topics')
            .description('Delete topics from this cluster')
            .argument('[topics...]', 'Topics to be deleted')
            .action(function (topics) {
            send({
                type: 'DELETE_TOPICS',
                payload: {
                    topics: topics,
                },
            });
        });
        commander
            .command('describe-cluster')
            .description('Get Cluster Information')
            .action(function () {
            send({
                type: 'DESCRIBE_CLUSTER',
                payload: {},
            });
        });
        commander
            .command('describe-groups')
            .description('Get Groups Information')
            .argument('[groups...]')
            .action(function (groups) {
            send({
                type: 'DESCRIBE_GROUPS',
                payload: {
                    groups: groups.map(function (name) { return ({ groupId: name }); }),
                },
            });
        });
        commander
            .command('describe-topics')
            .description('Get Topics Information')
            .argument('[topics...]')
            .action(function (topics) {
            send({
                type: 'DESCRIBE_TOPICS',
                payload: {
                    topics: topics,
                },
            });
        });
        var cleanup = (0, cli_1.createCli)(commander, 'admin').cleanup;
        return cleanup;
    }; },
};
exports.default = services;
