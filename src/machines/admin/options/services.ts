import { ServiceConfig, AnyEventObject } from 'xstate';
import { IContext } from '../types';
import { Kafka } from 'kafkajs';
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

    const { cleanup } = createCli(commander, 'admin');
    return cleanup;
  },
};

export default services;
