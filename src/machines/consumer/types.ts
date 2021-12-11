import { IConsumerOptions } from '../../types';
export interface IContext {
  params: IConsumerOptions;
  log?: (...args: Array<any>) => void;
}
