import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LogService implements LoggerService {
  private readonly logger: winston.Logger;
  private context: string;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  setClassName(className: string) {
    this.context = className;
  }

  private formatLogMessage(message: string) {
    return `[${this.context}] ${message}`;
  }

  log(message: string, metadata?: object) {
    const formattedMessage = this.formatLogMessage(message);
    this.logger.info(formattedMessage, { ...metadata });
  }

  error(message: string, metadata?: object) {
    const formattedMessage = this.formatLogMessage(message);
    this.logger.error(formattedMessage, { ...metadata });
  }

  warn(message: string, metadata?: object) {
    const formattedMessage = this.formatLogMessage(message);
    this.logger.warn(formattedMessage, { ...metadata });
  }

  debug(message: string, metadata?: object) {
    const formattedMessage = this.formatLogMessage(message);
    this.logger.debug(formattedMessage, { ...metadata });
  }

  verbose(message: string, metadata?: object) {
    const formattedMessage = this.formatLogMessage(message);
    this.logger.verbose(formattedMessage, { ...metadata });
  }
}
