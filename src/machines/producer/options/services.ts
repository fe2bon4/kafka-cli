import { ServiceConfig, AnyEventObject } from 'xstate';
import { IContext } from '../types';
import { Kafka } from 'kafkajs';
import { Command } from 'commander';

type ServiceConfigMap = Record<string, ServiceConfig<IContext, AnyEventObject>>;

const services: ServiceConfigMap = {
  kafkaProducer:
    ({ params }) =>
    (send, onEvent) => {
      const kafka = new Kafka({
        clientId: params.id,
        brokers: params.brokers.split(','),
      });

      const producer = kafka.producer({
        allowAutoTopicCreation: true,
      });

      producer.connect().then(() => {
        send('CONNECTED');
      });

      onEvent((event) => {
        switch (event.type) {
          case 'SEND': {
            producer
              .send({
                topic: event.payload.topic,
                messages: [
                  {
                    value: event.payload.message,
                  },
                ],
              })
              .then((meta) => {
                send({
                  type: 'SENT',
                  payload: {
                    ...event.payload,
                  },
                });
              });
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
      .description('Send Text to Topic')
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
      .command('change-topic')
      .description('Change the current topic')
      .argument('[topic]')
      .action((topic) => {
        if (!topic) {
          return console.error(`change-topic [topic], topic is required`);
        }
        send({
          type: 'CHANGE_TOPIC',
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
