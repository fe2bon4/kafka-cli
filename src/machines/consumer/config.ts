import { AnyEventObject, AnyStateNodeDefinition, MachineConfig } from 'xstate';
import { IContext } from './types';

const config: MachineConfig<IContext, AnyStateNodeDefinition, AnyEventObject> =
  {
    id: 'consumer',
    initial: 'ready',
    invoke: {
      id: 'kafka-consumer',
      src: 'kafkaConsumer',
    },
    states: {
      intializing: {
        on: {
          CONNECTED: {
            target: 'ready',
          },
        },
      },
      ready: {
        entry: ['logReady'],
        invoke: [
          {
            id: 'standard-input',
            src: 'standardInput',
          },
        ],
        on: {
          SUBSCRIBE: {
            actions: ['sendInputToConsumer'],
          },
          SEND: {
            actions: ['sendInputToConsumer'],
          },
          SENT: {
            actions: [],
          },
        },
      },
    },
  };

export default config;
