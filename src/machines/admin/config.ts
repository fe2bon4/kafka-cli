import { AnyEventObject, AnyStateNodeDefinition, MachineConfig } from 'xstate';
import { IContext } from './types';

const config: MachineConfig<IContext, AnyStateNodeDefinition, AnyEventObject> =
  {
    id: 'admin',
    initial: 'intializing',
    invoke: {
      id: 'kafka-client',
      src: 'kafkaClient',
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
          '*': {
            actions: ['sendCommandToClient'],
          },
        },
      },
    },
  };

export default config;
