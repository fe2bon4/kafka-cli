import { ServiceConfig, AnyEventObject } from 'xstate';
import { IContext } from '../types';
import { Kafka } from 'kafkajs';
import { Command } from 'commander';

type ServiceConfigMap = Record<string, ServiceConfig<IContext, AnyEventObject>>;

const services: ServiceConfigMap = {
  kafkaClient:
    ({ params }) =>
    (send, onEvent) => {
      console.log(params);
      const kafka = new Kafka({
        clientId: params.id,
        brokers: params.brokers.split(','),
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
              const date = new Date();
              const topics = await admin.listTopics();
              console.log(
                `[${date.toLocaleString()}][list-topics]`,
                JSON.stringify(topics, null, 4)
              );
              break;
            }
            case 'LIST_GROUPS': {
              const date = new Date();
              const groups = await admin.listGroups();
              console.log(
                `[${date.toLocaleString()}][list-groups]`,
                JSON.stringify(groups, null, 4)
              );
              break;
            }
            case 'DESCRIBE_CLUSTER': {
              const date = new Date();
              const cluster = await admin.describeCluster();
              console.log(
                `[${date.toLocaleString()}][describe-cluster]`,
                JSON.stringify(cluster, null, 4)
              );
              break;
            }
            case 'DESCRIBE_GROUPS': {
              const date = new Date();
              const groupInfo = await admin.describeGroups([
                event.payload.groups,
              ]);
              console.log(
                `[${date.toLocaleString()}][describe-groups]`,
                JSON.stringify(groupInfo, null, 4)
              );
              break;
            }
            case 'DESCRIBE_TOPICS': {
              const date = new Date();
              const topicsInfo = await admin.fetchTopicMetadata({
                topics: event.payload.topics,
              });
              console.log(
                `[${date.toLocaleString()}][describe-topics]`,
                JSON.stringify(topicsInfo, null, 4)
              );
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

    commander.exitOverride();
    commander.outputHelp();

    const onInput = (buffer: Buffer) => {
      const input = buffer.toString().replace(/\n/g, '');
      if (!input) return;
      const argv = ['', '', ...input.split(' ')];
      try {
        commander.parse(argv);
      } catch (e: any) {
        if (e.exitCode === 0) return;
      }
    };

    process.stdin.on('data', onInput);
    return () => {
      process.stdin.off('data', onInput);
    };
  },
};

export default services;
