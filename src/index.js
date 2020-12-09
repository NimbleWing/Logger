import Winston from 'winston';
import 'winston-daily-rotate-file';

Winston.loggers.add('uncaught', {
  format: Winston.format.combine(
    Winston.format.label({ label: 'uncaught' }),
    Winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    Winston.format.simple(),
    Winston.format.printf(({
      level,
      message,
      label,
      timestamp,
    }) => `${timestamp} [${label}] ${level}: ${message}`),
  ),
  rejectionHandlers: [
    new Winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
  exceptionHandlers: [
    new Winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
});
export default class Logger {
  constructor(scope = 'main') {
    this.logger = Winston.createLogger({
      format: Winston.format.combine(
        Winston.format.label({ label: scope }),
        Winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        Winston.format.simple(),
        Winston.format.printf(({
          level,
          message,
          label,
          timestamp,
        }) => `${timestamp} [${label}] ${level}: ${message}`),
      ),
      transports: [
        new Winston.transports.Console({
          format: Winston.format.combine(
            Winston.format.colorize(),
            Winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            Winston.format.simple(),
            Winston.format.printf(({
              level,
              message,
              label,
              timestamp,
            }) => `${timestamp} [${label}] ${level}: ${message}`),
          ),
        }),
      ],
    });

    if (process.env.NODE_ENV === 'production') {
      this.logger.add(new Winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }));
      this.logger.add(new Winston.transports.DailyRotateFile({
        dirname: `logs/${scope}`,
        filename: `${scope}-%DATE%.log`,
        datePattern: 'YYYY_MM_DD_HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
      }));

      // this.logger.exceptions.handle(new Winston.transports.File({
      //   filename: 'logs/exceptions.log',
      // }));
      // this.logger.rejections.handle(new Winston.transports.File({
      //   filename: 'logs/rejections.log',
      // }));
    }
    return this.logger;
  }

  logger = null;
}
