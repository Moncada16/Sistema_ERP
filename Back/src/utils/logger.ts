import winston from 'winston';
import { config } from '../config';

// 🎨 Formatos personalizados
const formats = {
  // 📝 Formato para desarrollo
  development: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
      return `${timestamp} ${level}: ${message}${metaStr}`;
    })
  ),

  // 📊 Formato para producción
  production: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
};

// 📝 Niveles de log personalizados
const levels = {
  error: 0,    // 🔴 Errores críticos que requieren atención inmediata
  warn: 1,     // 🟡 Advertencias que no interrumpen el servicio
  info: 2,     // 🔵 Información general del sistema
  http: 3,     // 🌐 Solicitudes HTTP
  debug: 4     // 🟢 Información detallada para debugging
};

// 🎨 Colores para los niveles
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  debug: 'green'
};

// 📱 Agregar colores a winston
winston.addColors(colors);

// 🔧 Configuración del logger
const logger = winston.createLogger({
  level: config.logging.level,
  levels,
  format: config.server.nodeEnv === 'production'
    ? formats.production
    : formats.development,
  transports: [
    // 📝 Logs de consola
    new winston.transports.Console(),

    // 📁 Logs de error en archivo
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    // 📁 Todos los logs en archivo
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// 🔍 Funciones de utilidad
export const log = {
  // 📝 Logs básicos
  logError: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  http: (message: string, meta?: any) => logger.http(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),

  // 🎯 Logs específicos
  request: (req: any, extra?: any) => {
    logger.http(`${req.method} ${req.url}`, {
      requestId: req.id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      body: req.body,
      params: req.params,
      query: req.query,
      ...extra
    });
  },

  response: (req: any, res: any, extra?: any) => {
    logger.http(`${req.method} ${req.url} ${res.statusCode}`, {
      requestId: req.id,
      responseTime: res.get('X-Response-Time'),
      ...extra
    });
  },

  error: (error: any, req?: any) => {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: config.server.nodeEnv === 'development' ? error.stack : undefined,
      ...(req && {
        requestId: req.id,
        method: req.method,
        url: req.url,
        body: req.body
      })
    };

    logger.error('Error en la aplicación', errorInfo);
  }
};