import { IProducerOptions } from '../../types';
export interface IContext {
  params: IProducerOptions;
  log?: (...args: Array<any>) => void;
}
