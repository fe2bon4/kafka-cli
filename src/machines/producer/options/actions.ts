import { ActionFunctionMap, AnyEventObject, assign, send } from 'xstate';
import { IContext } from '../types';

const actions: ActionFunctionMap<IContext, AnyEventObject> = {
  logReady: ({ log }) => {
    if (!log) return console.log(`Kafka Producer is ready.`);
    log(`Kafka Producer is ready.`);
  },
  logTopicChanged: ({ log, params }) => {
    if (!log) return console.log(`Topic changed to '${params.topic}'`);
    log(`Topic changed to '${params.topic}'`);
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
  sendToStandardInput: send((_, e) => e, { to: 'standard-input' }),
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
