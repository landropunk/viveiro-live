/**
 * Sistema de logging condicional para producción
 * En producción, solo se muestran errores y warnings críticos
 * En desarrollo, se muestran todos los logs
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_SERVER = typeof window === 'undefined';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (!IS_PRODUCTION) return true;

    // En producción, solo mostrar errores y warnings
    return level === 'error' || level === 'warn';
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const env = IS_SERVER ? '[SERVER]' : '[CLIENT]';
    return `${timestamp} ${env} [${level.toUpperCase()}]`;
  }

  log(message: string, ...args: any[]) {
    if (this.shouldLog('log')) {
      console.log(this.formatMessage('log', message), message, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), message, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), message, ...args);
    }
  }

  error(message: string, error?: Error | any, ...args: any[]) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), message, error, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), message, ...args);
    }
  }

  /**
   * Para logs de API que solo queremos en desarrollo
   */
  api(endpoint: string, status: number, data?: any) {
    if (!IS_PRODUCTION) {
      console.log(
        this.formatMessage('log', `API ${endpoint}`),
        `📡 API: ${endpoint} (${status})`,
        data ? `Data:` : '',
        data || ''
      );
    }
  }
}

export const logger = new Logger();
