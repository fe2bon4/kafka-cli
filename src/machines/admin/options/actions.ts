import { ActionFunctionMap, AnyEventObject, assign, send } from 'xstate';
import { IContext } from '../types';

const actions: ActionFunctionMap<IContext, AnyEventObject> = {
  logReady: () => {
    console.log(`Kafka Client is ready.`);
  },
  sendCommandToClient: send((_, e) => e, {
    to: 'kafka-client',
  }),
  updateParams: assign({
    params: ({ params }, { payload }) => {
      return {
        ...params,
        ...payload,
      };
    },
  }),
};

export default actions;
