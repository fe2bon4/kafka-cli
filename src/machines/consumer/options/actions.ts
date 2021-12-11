import { ActionFunctionMap, AnyEventObject, assign, send } from 'xstate';
import { IContext } from '../types';

const actions: ActionFunctionMap<IContext, AnyEventObject> = {
  logReady: () => {
    console.log(`Kafka Consumer is ready.`);
  },
  sendInputToConsumer: send(
    ({ params }, { payload, ...rest }) => ({
      ...rest,
      payload: {
        topic: params.topic,
        ...payload,
      },
    }),
    {
      to: 'kafka-consumer',
    }
  ),
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
