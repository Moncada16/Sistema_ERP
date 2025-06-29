// src/app.ts
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

// 🔧 Configuración de rate limiting
const limiter = rateLimit({
  windowMs: config.limits.rateLimit.windowMs,
  max: config.limits.rateLimit.max,
  message: { error: '🚫 Demasiadas solicitudes, por favor intente más tarde' }
});


const app = express();

// 🧠 Middlewares de seguridad y optimización
app.use(compression()); // Compresión gzip
app.use(limiter); // Rate limiting

// 🛡️ CORS y seguridad
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight por 10 minutos
}));

// 🛡️ Configuración de seguridad con Helmet
app.use(helmet({
  ...config.security.helmet,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: config.server.nodeEnv === 'production',
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true
}));

// 📦 Parseo de datos
app.use(express.json({ limit: config.limits.bodySize }));
app.use(express.urlencoded({ extended: true, limit: config.limits.bodySize }));

// 📋 Logger HTTP personalizado
morgan.token('body', (req: Request) => {
  const body = { ...req.body };
  // Ocultar campos sensibles
  if (body.password) body.password = '***';
  if (body.token) body.token = '***';
  return JSON.stringify(body);
});

app.use(morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms - :body',
  {
    skip: (req) => req.path === '/health' || req.path === '/favicon.ico'
  }
));

// Extender la interfaz Request para incluir id
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

// ⏱️ Timeout y tracking de solicitudes
app.use((req: Request, res: Response, next: NextFunction) => {
  // Agregar ID único a la solicitud
  req.id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Configurar timeout
  const timeout = setTimeout(() => {
    res.status(408).json({
      error: '🕒 Tiempo de espera agotado',
      requestId: req.id
    });
  }, config.limits.requestTimeout);

  // Limpiar timeout cuando la respuesta se complete
  res.on('finish', () => clearTimeout(timeout));

  // Tracking de inicio de solicitud
  console.log(`🎯 Nueva solicitud: ${req.id} - ${req.method} ${req.path}`);
  
  next();
})

// ✅ Ruta de salud
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: '🟢 Operativo',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// 🌐 Rutas agrupadas bajo /api
app.use(config.server.apiPrefix, apiRouter);
// 📂 Servir los archivos del folder public
app.use(express.static(path.join(__dirname, '../public')));

// 🏠 Cuando alguien visita "/", mostrar el HTML
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ❌ 404 — Ruta no encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: '🚫 Ruta no encontrada',
    path: req.path,
    method: req.method,
    requestId: req.id
  });
});

// 💣 Error handler global
app.use(errorHandler);

export default app;
