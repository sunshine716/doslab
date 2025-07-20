const pino = require('pino');
const day = new Date().toISOString().slice(5, 10).replace('-', ''); // e.g., "0719"

const transport = pino.transport({
  targets: [
    {
      level: 'debug',           // Log everything to console
      target: 'pino-pretty',    // pretty-print for dev
      options: { colorize: true }
    },
    {
      level: 'info',            // info and above to info log
      target: 'pino/file',
      options: {
        destination: `./logs/info.${day}.log`,
        mkdir: true
      }
    },
    {
      level: 'error',           // error and above to error log
      target: 'pino/file',
      options: {
        destination: `./logs/err.${day}.log`,
        mkdir: true
      }
    }
  ]
});

const logger = pino(
  {
    level: 'debug' // ← this is the default minimum level for all logs
  },
  transport
);

module.exports = logger;
