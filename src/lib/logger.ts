/* eslint-disable no-console */
import env from '@/lib/env';

interface ILog {
  log(level: LogLevel, message: string): void;
  info(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
}

type LogLevel = 'log' | 'info' | 'error' | 'warn' | 'debug';
const LogLevels: LogLevel[] = ['log', 'info', 'error', 'warn', 'debug'];

class Logger implements ILog {
  private readonly currentLogLevel: LogLevel = 'log';

  public constructor() {
    const level = env('LOG_LEVEL', LogLevels[0]);
    if (
      LogLevels.includes(<'log' | 'info' | 'error' | 'warn' | 'debug'>level)
    ) {
      this.currentLogLevel = level as LogLevel;
    }
  }

  private canLog(level: LogLevel): boolean {
    return LogLevels.indexOf(level) >= LogLevels.indexOf(this.currentLogLevel);
  }

  // eslint-disable-next-line class-methods-use-this
  private formatMessage(level: LogLevel, message: string): string {
    const { stack } = new Error();
    const stackLine = stack?.split('\n')[3].trim();

    if (!stackLine) return message;
    const stackDetails =
      /\s*at\s+(.*)\s+\((.*):(\d+):(\d+)\)/.exec(stackLine) ||
      /\s*at\s+(.*):(\d+):(\d+)/.exec(stackLine);

    let functionName;
    let fileName;
    let lineNumber;

    if (stackDetails) {
      [, functionName, fileName, lineNumber] = stackDetails;
    } else {
      functionName = 'anonymous';
      fileName = 'anonymous';
      lineNumber = 'anonymous';
    }

    return `[${new Date().toISOString()}] ${level.toUpperCase()} ${message} at ${functionName} (${fileName}:${lineNumber})`;
  }

  log(level: LogLevel, ...message: string[]): void {
    if (!this.canLog(level)) return;
    console[level](this.formatMessage(level, message.join(' ')));
  }

  info(...message: string[]): void {
    if (!this.canLog('info')) return;
    console.info(this.formatMessage('info', message.join(' ')));
  }

  error(...message: string[]): void {
    if (!this.canLog('error')) return;
    console.error(this.formatMessage('error', message.join(' ')));
  }

  warn(...message: string[]): void {
    if (!this.canLog('warn')) return;
    console.warn(this.formatMessage('warn', message.join(' ')));
  }

  debug(...message: string[]): void {
    if (!this.canLog('debug')) return;
    console.debug(this.formatMessage('debug', message.join(' ')));
  }
}

const logger = new Logger();

export default logger;
