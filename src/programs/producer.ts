import { Command } from 'commander';
import { IProducerOptions } from '../types';
import { Interpret } from '../machines/producer';

module.exports = (options: IProducerOptions) => {
  const service = Interpret({
    params: options,
  });

  service.start();
};
