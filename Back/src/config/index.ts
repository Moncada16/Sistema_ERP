import dotenv from 'dotenv';

// 🔧 Cargar variables de entorno
dotenv.config();

// 🌐 Configuración de la aplicación
export const config = {
  // 🚀 Servidor
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: '/api',
    corsOrigin: process.env.CLIENT_URL || 'http://localhost:3000'
  },

  // 🔐 Autenticación
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: '8h',
    saltRounds: 10,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutos
    passwordMinLength: 8
  },

  // 💾 Base de datos
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: 20,
    ssl: process.env.NODE_ENV === 'production'
  },

  // 📋 Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'dev'
  },

  // ⚙️ Límites y timeouts
  limits: {
    bodySize: '10mb',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100 // límite de solicitudes por ventana
    },
    requestTimeout: 30000 // 30 segundos
  },

  // 🔒 Seguridad
  security: {
    helmet: {
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
      crossOriginOpenerPolicy: process.env.NODE_ENV === 'production',
      crossOriginResourcePolicy: process.env.NODE_ENV === 'production'
    }
  }
};

// ✅ Validar configuración crítica
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`❌ Variable de entorno requerida: ${envVar}`);
  }
});

// 🔍 Validar configuración de producción
if (config.server.nodeEnv === 'production') {
  if (!config.security.helmet.contentSecurityPolicy) {
    console.warn('⚠️ Se recomienda habilitar Content Security Policy en producción');
  }
  
  if (config.auth.jwtSecret === 'your-secret-key') {
    throw new Error('❌ Debe configurar una clave JWT segura en producción');
  }
}