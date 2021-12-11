import { interpret, createMachine } from 'xstate';
import { prefixLog } from '../../utils/cli';
import config from './config';
import options from './options';
import { IContext } from './types';

export const spawn = (context: IContext) => {
  return createMachine(
    {
      ...config,
      context: {
        ...context,
        log: prefixLog('producer'),
      },
    },
    options
  );
};

export const Interpret = (context: IContext, start = false) => {
  const machine = spawn(context);

  const instance = interpret(machine);

  if (!start) return instance;

  instance.start();

  return instance;
};

export * from './types';
