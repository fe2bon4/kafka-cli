import { Command } from 'commander';
import { EventEmitter } from 'stream';

export const prefixLog = (prefix: string) => {
  return (...args: Array<any>) => {
    const date = new Date();
    console.log(`${date.toLocaleString()} [${prefix}]:`, ...args);
  };
};

export const prefixInput = (prefix: string) => {
  return (nl = '') => {
    const date = new Date();
    process.stdout.write(`${nl}${date.toLocaleString()} [${prefix}]# `);
  };
};

export const createCli = (
  commander: Command,
  service_name: string,
  emitter: EventEmitter = process.stdin
) => {
  const prompter = prefixInput(service_name);
  let prompterTimeout: NodeJS.Timeout | undefined;

  commander
    .command('clear')
    .description('Clear Console')
    .action(() => {
      console.clear();
    });

  commander.exitOverride();
  commander.outputHelp();

  const queuePrompter = (args: string, ttl = 300) => {
    if (prompterTimeout) clearTimeout(prompterTimeout);

    setTimeout(() => prompter(args), ttl);
  };
  const onInput = (buffer: Buffer) => {
    const input = buffer.toString().replace(/\n/g, '');

    if (!input) {
      setImmediate(() => prompter());
      return;
    }

    const argv = ['', '', ...input.split(' ')];
    try {
      commander.parse(argv);
      queuePrompter('\n');
    } catch (e: any) {
      setImmediate(() => prompter(''));
      if (e.exitCode === 0) return;
    }
  };

  emitter.on('data', onInput);
  setTimeout(() => prompter(), 200);
  return {
    prompt: prompter,
    cleanup: () => {
      emitter.off('data', onInput);
    },
  };
};
