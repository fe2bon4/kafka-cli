import { ServiceConfig, AnyEventObject } from 'xstate';
import { IContext } from '../types';
import { Kafka } from 'kafkajs';
import { Command } from 'commander';
import { createCli } from '../../../utils/cli';

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
  standardInput:
    ({ log, params }) =>
    (send, onEvent) => {
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
          pause();
        });

      commander
        .command('change-topic')
        .description('Change the current topic')
        .argument('[topic]')
        .action((topic) => {
          if (!topic) {
            return log!(`change-topic [topic], topic is required`);
          }
          send({
            type: 'CHANGE_TOPIC',
            payload: {
              topic,
            },
          });
        });

      const { cleanup, pause, resume } = createCli(commander, 'producer');

      log!(`Current Topic:`, params.topic);

      onEvent((e) => {
        switch (e.type) {
          case 'SENT':
            resume();
            break;
          default:
            log!(e);
            break;
        }
      });
      return cleanup;
    },
};

export default services;
