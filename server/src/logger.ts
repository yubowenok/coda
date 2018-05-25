import * as winston from 'winston';

const customLevels = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  },
  colors: {
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red'
  }
};
export const logger = new (winston.Logger)({
  level: 'error',
  levels: customLevels.levels,
  transports: [
    new (winston.transports.Console)({
      json: false,
      timestamp: true,
      colorize: true
    }),
  ],
  exitOnError: false
});
