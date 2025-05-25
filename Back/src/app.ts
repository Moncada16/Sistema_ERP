// src/app.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes';


dotenv.config();

const app = express();

// 🧠 Middlewares de seguridad y parsing
app.use(cors()); // 🔓 CORS abierto — configúralo en prod
app.use(helmet()); // 🛡️ Seguridad HTTP headers
app.use(express.json()); // 📦 Parseo JSON
app.use(express.urlencoded({ extended: true })); // 📦 Form-urlencoded
app.use(morgan('dev')); // 📋 Logger HTTP

// ✅ Ruta de salud
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('🟢 ERP Backend operativo');
});

// 🌐 Rutas agrupadas bajo /api
app.use('/api', apiRouter);

// ❌ 404 — Ruta no encontrada
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: '🚫 Ruta no encontrada' });
});

// 💣 Error handler global
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🧨 Error:', err);
  res.status(err.status || 500).json({
    error: err.message || '⚠️ Error interno del servidor'
  });
});

export default app;
