import { ServiceConfig, AnyEventObject } from 'xstate';
import { IContext } from '../types';
import { ITopicConfig, ITopicPartitionConfig, Kafka } from 'kafkajs';
import { Command } from 'commander';
import { createCli } from '../../../utils/cli';
import { createLogger } from '../../../utils/kafkajs';
type ServiceConfigMap = Record<string, ServiceConfig<IContext, AnyEventObject>>;

const services: ServiceConfigMap = {
  kafkaClient:
    ({ params, log }) =>
    (send, onEvent) => {
      const kafka = new Kafka({
        clientId: params.id,
        brokers: params.brokers.split(','),
        logCreator: createLogger(log!),
      });

      const admin = kafka.admin();

      admin.connect().then(() => {
        send('CONNECTED');
      });

      onEvent(async (event) => {
        try {
          switch (event.type) {
            case 'COMMAND': {
              break;
            }
            case 'LIST_TOPICS': {
              const topics = await admin.listTopics();
              log!(`[list-topics]`, JSON.stringify(topics, null, 4));
              break;
            }

            case 'CREATE_TOPICS': {
              const created = await admin.createTopics({
                waitForLeaders: false,
                topics: event.payload.topics,
              });

              log!(
                `[created:${created}]`,
                event.payload.topics.map(({ topic }: ITopicConfig) => topic)
              );
              break;
            }
            case 'CREATE_PARTITIONS': {
              const updated = await admin.createPartitions({
                topicPartitions: [event.payload],
              });

              log!(
                `[updated:${updated}][topic:${event.payload.topic}][partitions:${event.payload.count}]`
              );
              break;
            }

            case 'LIST_OFFSETS_TOPIC': {
              const result = await admin.fetchTopicOffsets(event.payload.topic);

              log!('[list-topic-offsets]', result);
              break;
            }
            case 'DELETE TOPICS': {
              await admin
                .deleteTopics({
                  topics: event.payload.topics,
                })
                .then(() => {
                  log!(
                    `[deleted:true]`,
                    event.payload.topics.map(({ topic }: ITopicConfig) => topic)
                  );
                })
                .catch((e) => {
                  log!(
                    `[deleted:false]`,
                    event.payload.topics.map(
                      ({ topic }: ITopicConfig) => topic
                    ),
                    e
                  );
                });

              break;
            }
            case 'LIST_GROUPS': {
              const groups = await admin.listGroups();
              log!(`[list-groups]`, JSON.stringify(groups, null, 4));
              break;
            }
            case 'DESCRIBE_CLUSTER': {
              const cluster = await admin.describeCluster();
              log!(`[describe-cluster]`, JSON.stringify(cluster, null, 4));
              break;
            }
            case 'DESCRIBE_GROUPS': {
              const groupInfo = await admin.describeGroups([
                event.payload.groups,
              ]);
              log!(`[describe-groups]`, JSON.stringify(groupInfo, null, 4));

              break;
            }
            case 'DESCRIBE_TOPICS': {
              const topicsInfo = await admin.fetchTopicMetadata({
                topics: event.payload.topics,
              });
              log!(`[describe-topics]`, JSON.stringify(topicsInfo, null, 4));
              break;
            }
            default:
              console.log(event);
              break;
          }
        } catch (e: any) {
          const date = new Date();
          console.log(`[${date.toLocaleString()}][error]`, e.message);
        }
      });
    },
  standardInput: () => (send) => {
    const commander = new Command();

    commander
      .command('create-topics')
      .description('Create topics on this cluster')
      .argument('[topics...]', 'Topics to be created')
      .option(
        '-p, --partitions [partitions]',
        'Number of partitions for each created topic',
        parseInt
      )
      .option(
        '-r, --replicas [replica]',
        'Number of replicas for each created topic',
        parseInt
      )
      .action((topics: Array<string>, { partitions = 1, replicas = 1 }) => {
        const topicConfigs: Array<ITopicConfig> = topics.map((topic) => {
          return {
            topic,
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
      .command('create-topic-partitions')
      .description('Create partitions to a topic on this cluster')
      .argument('[topic]', 'Topic to be partitioned')
      .option(
        '-p, --partitions [partitions]',
        'Number of partitions for topic',
        parseInt
      )
      .action((topic: string, { partitions = 1 }) => {
        console.log(topic, partitions);
        const payload: ITopicPartitionConfig = {
          count: partitions,
          topic,
        };
        send({
          type: 'CREATE_PARTITIONS',
          payload,
        });
      });

    commander
      .command('delete-topics')
      .description('Delete topics from this cluster')
      .argument('[topics...]', 'Topics to be deleted')
      .action((topics: Array<string>) => {
        send({
          type: 'DELETE_TOPICS',
          payload: {
            topics,
          },
        });
      });

    commander
      .command('describe-cluster')
      .description('Get Cluster Information')
      .action(() => {
        send({
          type: 'DESCRIBE_CLUSTER',
          payload: {},
        });
      });

    commander
      .command('describe-groups')
      .description('Get Groups Information')
      .argument('[groups...]')
      .action((groups) => {
        send({
          type: 'DESCRIBE_GROUPS',
          payload: {
            groups: groups.map((name: string) => ({ groupId: name })),
          },
        });
      });

    commander
      .command('describe-topics')
      .description('Get Topics Information')
      .argument('[topics...]')
      .action((topics) => {
        send({
          type: 'DESCRIBE_TOPICS',
          payload: {
            topics,
          },
        });
      });

    commander
      .command('list-groups')
      .description('List Consumer Groups in this cluster')
      .action(() => {
        send({
          type: 'LIST_GROUPS',
          payload: {},
        });
      });

    commander
      .command('list-topics')
      .description('List topics on this cluster')
      .action(() => {
        send({
          type: 'LIST_TOPICS',
          payload: {},
        });
      });

    commander
      .command('list-topic-offsets')
      .description('List Offsets of each partition in topic')
      .argument('[topic]', 'Topic')
      .action((topic: string) => {
        send({
          type: 'LIST_OFFSETS_TOPIC',
          payload: {
            topic,
          },
        });
      });
    const { cleanup } = createCli(commander, 'admin');
    return cleanup;
  },
};

export default services;
