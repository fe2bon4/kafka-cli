#!/usr/bin/env node
import { Command } from 'commander';
import { IOptions } from './types';
import { v4 } from 'uuid';
const program = new Command();

program
  .command('admin')
  .option('-i, --id <id>', 'Kafka Consumer Id')
  .requiredOption('-b, --brokers <brokers>')
  .description('Kafka Admin Client')
  .action((opts: IOptions) => {
    require(__dirname + '/programs/admin')(opts);
  });

program
  .command('producer')
  .option('-i, --id <id>', 'Kafka Consumer Id')
  .requiredOption('-b, --brokers <brokers>')
  .requiredOption('-t, --topic <topic>', 'Kafka topic to produce into.')
  .description('Kafka Producer Client')
  .action((opts: IOptions) => {
    require(__dirname + '/programs/producer')(opts);
  });

program
  .command('consumer')
  .option('-i, --id <id>', 'Kafka Consumer Id')
  .requiredOption('-g, --group <group>', 'Kafka Consumer Group')
  .requiredOption('-b, --brokers <brokers>')
  .requiredOption('-t, --topic <topic>', 'Kafka topic to consume from')
  .description('Kafka Consumer Client')
  .action((opts: IOptions) => {
    if (!opts.id) opts.id = v4();
    require(__dirname + '/programs/consumer')(opts);
  });

program.parse(process.argv);
