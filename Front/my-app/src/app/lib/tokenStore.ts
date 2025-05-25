// src/lib/tokenStore.ts

// 🔁 Reutiliza funciones de auth.ts para consistencia global
export { 
  setToken as setAccessToken, 
  getToken as getAccessToken, 
  removeToken 
} from './auth';
