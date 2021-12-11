import { IOptions } from '../types';
import { Interpret } from '../machines/admin';

module.exports = (options: IOptions) => {
  const service = Interpret({
    params: options,
  });

  service.start();
};
