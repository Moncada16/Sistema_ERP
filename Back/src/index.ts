import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from 'src/modules/auth/routes/auth.routes';
import apiRouter from './routes';  // Importa el Router agrupador de src/routes/index.ts

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3002',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
// app.use('/api/auth', authRoutes);  // Login, register, refresh, logout
app.use('/api', apiRouter);        // Todas las demás rutas: users, empresa, bodegas, etc.

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
