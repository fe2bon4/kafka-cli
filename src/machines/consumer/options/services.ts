import { ServiceConfig, AnyEventObject } from 'xstate';
import { IContext } from '../types';
import { EachMessagePayload, Kafka, logLevel } from 'kafkajs';
import { Command } from 'commander';
import { createCli } from '../../../utils/cli';
import { createLogger } from '../../../utils/kafkajs';

type ServiceConfigMap = Record<string, ServiceConfig<IContext, AnyEventObject>>;

const services: ServiceConfigMap = {
  kafkaConsumer:
    ({ params, log }) =>
    (send, onEvent) => {
      const kafka = new Kafka({
        clientId: params.id,
        brokers: params.brokers.split(','),
        logLevel: logLevel.ERROR,
        logCreator: createLogger(log!),
      });

      const consumer = kafka.consumer({
        sessionTimeout: 10000,
        heartbeatInterval: 2000,
        groupId: params.group,
      });

      const { GROUP_JOIN, CONNECT } = consumer.events;

      consumer.on(GROUP_JOIN, () => {
        send('CONNECTED');
      });

      consumer.on(CONNECT, () => {});

      const onEachMessage = async ({
        topic,
        message,
        partition,
      }: EachMessagePayload) => {
        log!(
          'Got Message',
          `\n[topic:${topic}][partition:${partition}]`,
          message.value?.toString()
        );
      };

      consumer.connect().then(() => {
        consumer.subscribe({ topic: params.topic });
        consumer.run({
          eachMessage: onEachMessage,
        });
      });

      onEvent((event) => {
        switch (event.type) {
          case 'SEND': {
            console.log(event);
            break;
          }
          case 'SUBSCRIBE': {
            consumer.subscribe({ ...event.payload });
            break;
          }
          case 'SEEK': {
            consumer.seek({
              ...event.payload,
            });
            break;
          }
          case 'START': {
            consumer
              .run({
                eachMessage: onEachMessage,
              })
              .then(() => log!('Consumer is now running'));
            break;
          }
          case 'STOP': {
            consumer.stop().then(() => log!(`Consumer has stopped`));
            break;
          }
          case 'CONNECTED': {
            log!('Consumer has reconnected');
            break;
          }
          default:
            log!('@Consumer', event);
            break;
        }
      });
    },
  standardInput:
    ({ log }) =>
    (send) => {
      const commander = new Command();

      commander
        .command('send')
        .description('Send Input to Consumer Service')
        .argument('[messages...]')
        .action((messages) => {
          if (!messages.length) return;
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
        .action(() => {
          send({
            type: 'START',
            payload: {},
          });
        });

      commander
        .command('stop')
        .description('Stop this consumer')
        .action(() => {
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
        .action((topic, { beginning }) => {
          if (!topic) {
            return log!(`Subscribe [topic], topic is required`);
          }
          send({
            type: 'SUBSCRIBE',
            payload: {
              topic,
              fromBeginning: beginning,
            },
          });
        });

      commander
        .command('seek')
        .description('Seek topic offset')
        .argument('[topic]')
        .option(
          '-o, --offset [offset]',
          'Index to set the seek offset',
          parseInt
        )
        .option(
          '-p, --partition [partition]',
          'Partition of the topic',
          parseInt
        )
        .action((topic, { offset, partition = 0 }) => {
          if (!topic) {
            return log!(`[error] subscribe [topic], topic is required`);
          }

          if (isNaN(offset)) {
            return log!(`[error] -o|--offset [offset], offset is required`);
          }

          if (partition < 0) {
            return log!(
              `[error] -p|--partition [partition], partition cannot be less than 0`
            );
          }

          send({
            type: 'SEEK',
            payload: {
              topic,
              offset,
              partition,
            },
          });
        });

      const { cleanup, pause, resume, prompt } = createCli(
        commander,
        'consumer'
      );

      return cleanup;
    },
};

export default services;
