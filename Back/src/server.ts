// src/server.ts

import dotenv from 'dotenv';
// 🛡️ Cargar variables de entorno antes que nada
dotenv.config();

import app from './app';

const PORT: number = parseInt(process.env.PORT || '3002');

// 🚀 Lanzar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en → http://localhost:${PORT}`);
});

// 🧯 Manejo de errores críticos no capturados
process.on('uncaughtException', (err) => {
  console.error('💥 Excepción no capturada:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Rechazo de promesa no manejado:', reason);
});
