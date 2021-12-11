import { AnyEventObject, AnyStateNodeDefinition, MachineConfig } from 'xstate';
import { IContext } from './types';

const config: MachineConfig<IContext, AnyStateNodeDefinition, AnyEventObject> =
  {
    id: 'producer',
    initial: 'intializing',
    invoke: {
      id: 'kafka-producer',
      src: 'kafkaProducer',
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
          CHANGE_TOPIC: {
            actions: ['updateParams', 'logTopicChanged'],
          },
          SENT: {
            actions: ['sendToStandardInput'],
          },
          DONE: {
            actions: ['sendToStandardInput'],
          },
          '*': {
            actions: ['sendInputToProducer'],
          },
        },
      },
    },
  };

export default config;
