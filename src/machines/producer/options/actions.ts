import { ActionFunctionMap, AnyEventObject, assign, send } from 'xstate';
import { IContext } from '../types';

const actions: ActionFunctionMap<IContext, AnyEventObject> = {
  logReady: () => {
    console.log(`Kafka Producer is ready.`);
  },
  sendInputToProducer: send(
    ({ params }, { payload, ...rest }) => ({
      ...rest,
      payload: {
        ...payload,
        topic: params.topic,
      },
    }),
    {
      to: 'kafka-producer',
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
