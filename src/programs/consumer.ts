import { IConsumerOptions } from '../types';
import { Interpret } from '../machines/consumer';

module.exports = (options: IConsumerOptions) => {
  const service = Interpret({
    params: options,
  });

  service.start();
};
