import { logCreator } from 'kafkajs';

export const createLogger =
  (log: (...args: Array<any>) => void): logCreator =>
  (logLevel) =>
  ({ label, namespace, level, log: logObj }) => {
    if (level > logLevel) return;

    log!(`[namespace:${namespace}][${label}]`, logObj.message);
  };
