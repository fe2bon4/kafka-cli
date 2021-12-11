export interface IOptions {
  brokers: string;
  id: string;
}

export interface IProducerOptions extends IOptions {
  topic: string;
}

export interface IConsumerOptions extends IOptions {
  topic: string;
  group: string;
}
