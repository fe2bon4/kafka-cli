import { IOptions } from '../../types';
export interface IContext {
  params: IOptions;
  log?: (...args: Array<any>) => void;
}
