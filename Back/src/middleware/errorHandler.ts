import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { log } from '../utils/logger';
import { config } from '../config';

// 🔑 Tipos de error personalizados
export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

// 🎯 Interfaz para errores estructurados
interface StructuredError {
  message: string;
  type: string;
  statusCode: number;
  details?: any;
  stack?: string;
}

// 🛡️ Middleware de manejo de errores
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // 📝 Logging del error
  log.error(err, _req);

  // 🏗️ Estructura base del error
  const structuredError: StructuredError = {
    message: 'Error interno del servidor',
    type: 'ServerError',
    statusCode: 500
  };

  // 🔍 Manejo de errores específicos
  if (err instanceof AppError) {
    structuredError.message = err.message;
    structuredError.type = err.name;
    structuredError.statusCode = err.statusCode;
  } 
  // 🔐 Errores de Prisma
  else if (err instanceof PrismaClientKnownRequestError) {
    structuredError.type = 'DatabaseError';
    structuredError.statusCode = 400;

    switch (err.code) {
      case 'P2002':
        structuredError.message = 'Ya existe un registro con estos datos';
        structuredError.details = err.meta;
        break;
      case 'P2014':
        structuredError.message = 'El registro está siendo utilizado por otros registros';
        break;
      case 'P2003':
        structuredError.message = 'El registro relacionado no existe';
        break;
      default:
        structuredError.message = 'Error en la base de datos';
    }
  } 
  // 🔒 Errores de JWT
  else if (err.name === 'JsonWebTokenError') {
    structuredError.message = 'Token inválido';
    structuredError.type = 'AuthenticationError';
    structuredError.statusCode = 401;
  } 
  else if (err.name === 'TokenExpiredError') {
    structuredError.message = 'Token expirado';
    structuredError.type = 'AuthenticationError';
    structuredError.statusCode = 401;
  }

  // 🐛 Incluir stack trace en desarrollo
  if (config.server.nodeEnv === 'development') {
    structuredError.stack = err.stack;
  }

  // 📊 Agregar información adicional en desarrollo
  if (config.server.nodeEnv === 'development') {
    structuredError.details = {
      path: _req.path,
      method: _req.method,
      timestamp: new Date().toISOString(),
      requestId: _req.id
    };
  }

  // ✨ Enviar respuesta
  res.status(structuredError.statusCode).json(structuredError);
};