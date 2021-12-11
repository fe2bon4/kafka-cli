import { AnyEventObject, AnyStateNodeDefinition, MachineConfig } from 'xstate';
import { IContext } from './types';

const config: MachineConfig<IContext, AnyStateNodeDefinition, AnyEventObject> =
  {
    id: 'consumer',
    initial: 'intializing',
    invoke: {
      id: 'kafka-consumer',
      src: 'kafkaConsumer',
    },
    states: {
      intializing: {
        entry: 'logInitializing',
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
          '*': {
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
