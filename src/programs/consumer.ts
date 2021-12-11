import { Command } from 'commander';
import { IOptions } from '../types';

module.exports = (options: IOptions) => {
  const program = new Command();

  console.log('here', options);
};
