import { ActionFunctionMap, AnyEventObject, assign, send } from 'xstate';
import { IContext } from '../types';

const actions: ActionFunctionMap<IContext, AnyEventObject> = {
  logInitializing: ({ log, params }) => {
    if (!log)
      console.log(`Kafka Consumer ${params.id} is now joining ${params.group}`);
    log!(`Kafka Consumer ${params.id} is now joining ${params.group}`);
  },
  logReady: ({ log }) => {
    if (!log) console.log(`Kafka Consumer is ready.`);
    log!(`Kafka Consumer is ready.`);
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
