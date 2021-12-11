import { Command } from 'commander';
import { EventEmitter } from 'stream';

export const prefixLog = (prefix: string) => {
  return (...args: Array<any>) => {
    const date = new Date();
    console.log(`${date.toLocaleString()} [${prefix}]:`, '\r\n', ...args);
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
  tty: EventEmitter = process.stdin
) => {
  const prompter = prefixInput(service_name);
  let prompterTimeout: NodeJS.Timeout | undefined;

  commander
    .command('clear')
    .description('Clear Console')
    .action(() => {
      console.clear();
    });

  commander
    .command('exit')
    .description('Exit command line interface')
    .action(() => {
      process.exit(0);
    });

  commander.exitOverride((error) => {
    console.log(error);
    if (error.exitCode === 0) return;

    console.error(error.message);
  });

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

  const pause = () => {
    tty.off('data', onInput);
  };

  const resume = () => {
    tty.on('data', onInput);
    prompter();
  };

  tty.on('data', onInput);
  setTimeout(() => prompter(), 100);
  return {
    pause,
    prompt: prompter,
    resume,
    cleanup: () => tty.off('data', onInput),
  };
};
