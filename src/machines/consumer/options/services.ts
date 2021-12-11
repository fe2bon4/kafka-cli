import { ServiceConfig, AnyEventObject } from 'xstate';
import { IContext } from '../types';
import { Kafka } from 'kafkajs';
import { Command } from 'commander';

type ServiceConfigMap = Record<string, ServiceConfig<IContext, AnyEventObject>>;

const services: ServiceConfigMap = {
  kafkaConsumer:
    ({ params }) =>
    (send, onEvent) => {
      console.log(params);
      const kafka = new Kafka({
        clientId: params.id,
        brokers: params.brokers.split(','),
      });

      const consumer = kafka.consumer({
        groupId: params.group,
      });

      consumer.connect().then(() => {
        send('CONNECTED');

        consumer.subscribe({ topic: params.topic });

        consumer.run({
          eachMessage: async ({ topic, message }) => {
            const date = new Date();
            console.log(
              `[${date.toLocaleString()}][topic:${topic}]`,
              message.value?.toString()
            );
          },
        });
      });

      onEvent((event) => {
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
    },
  standardInput: () => (send) => {
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
      .command('subscribe')
      .description('subscribe to topic')
      .argument('[topic]')
      .action((topic) => {
        if (!topic) {
          return console.error(`subscribe [topic], topic is required`);
        }
        send({
          type: 'SUBSCRIBE',
          payload: {
            topic,
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
