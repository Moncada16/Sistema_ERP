// src/lib/auth.ts - SISTEMA DE AUTENTICACIÓN CORREGIDO
'use client'

// ==========================================
// CONSTANTS Y CONFIGURACIÓN
// ==========================================

const STORAGE_KEYS = {
  TOKEN: 'bendito_calzado_token',
  USER: 'bendito_calzado_user',
  REFRESH_TOKEN: 'bendito_calzado_refresh_token',
  REMEMBER_ME: 'bendito_calzado_remember_me'
} as const

const TOKEN_CONFIG = {
  EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutos antes de expirar
  AUTO_REFRESH_THRESHOLD: 10 * 60 * 1000, // Renovar si quedan menos de 10 min
} as const

// ==========================================
// TIPOS DE DATOS - CORREGIDOS
// ==========================================

export interface UserData {
  userId: number
  empresaId: number | null
  nombre: string
  email: string
  rol: string
  photo?: string
  img?: string
}

export interface TokenPayload {
  userId: number
  empresaId?: number | null
  nombre?: string
  email?: string
  rol?: string
  photo?: string
  img?: string
  exp?: number
  iat?: number
}

// ==========================================
// UTILIDADES DE STORAGE
// ==========================================

/**
 * Verifica si estamos en el cliente (browser)
 */
const isClient = (): boolean => typeof window !== 'undefined'

/**
 * Obtiene un item del localStorage de forma segura
 */
const getStorageItem = (key: string): string | null => {
  if (!isClient()) return null
  
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn(`Error accediendo a localStorage para ${key}:`, error)
    return null
  }
}

/**
 * Guarda un item en localStorage de forma segura
 */
const setStorageItem = (key: string, value: string): boolean => {
  if (!isClient()) return false
  
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`Error guardando en localStorage para ${key}:`, error)
    return false
  }
}

/**
 * Elimina un item del localStorage de forma segura
 */
const removeStorageItem = (key: string): boolean => {
  if (!isClient()) return false
  
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Error eliminando de localStorage para ${key}:`, error)
    return false
  }
}

// ==========================================
// GESTIÓN DE TOKENS
// ==========================================

/**
 * Guarda el token de acceso
 */
export const setToken = (token: string): boolean => {
  console.log('🔐 Guardando token de acceso...')
  return setStorageItem(STORAGE_KEYS.TOKEN, token)
}

/**
 * Obtiene el token de acceso
 */
export const getToken = (): string | null => {
  return getStorageItem(STORAGE_KEYS.TOKEN)
}

/**
 * Elimina el token de acceso
 */
export const removeToken = (): boolean => {
  console.log('🗑️ Eliminando token de acceso...')
  return removeStorageItem(STORAGE_KEYS.TOKEN)
}

/**
 * Guarda el refresh token
 */
export const setRefreshToken = (refreshToken: string): boolean => {
  console.log('🔄 Guardando refresh token...')
  return setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
}

/**
 * Obtiene el refresh token
 */
export const getRefreshToken = (): string | null => {
  return getStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * Elimina el refresh token
 */
export const removeRefreshToken = (): boolean => {
  console.log('🗑️ Eliminando refresh token...')
  return removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN)
}

// ==========================================
// VALIDACIÓN Y DECODIFICACIÓN DE TOKENS
// ==========================================

/**
 * Decodifica un JWT token sin verificar la firma - CORREGIDO
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    // Verificar formato JWT básico
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('❌ Token no tiene formato JWT válido')
      return null
    }

    // Decodificar payload
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const decoded = JSON.parse(jsonPayload) as TokenPayload
    return decoded
  } catch (error) {
    console.error('❌ Error decodificando token:', error)
    return null
  }
}

/**
 * Verifica si un token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token)
    if (!decoded?.exp) return true
    
    const currentTime = Date.now() / 1000
    const isExpired = decoded.exp < (currentTime + TOKEN_CONFIG.EXPIRY_BUFFER / 1000)
    
    if (isExpired) {
      console.warn('⚠️ Token expirado detectado')
    }
    
    return isExpired
  } catch (error) {
    console.error('❌ Error verificando expiración del token:', error)
    return true
  }
}

/**
 * Verifica si un token es válido
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false
  if (token.length < 10) return false // Token muy corto
  if (isTokenExpired(token)) return false
  
  return true
}

/**
 * Obtiene el tiempo restante del token en milisegundos
 */
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const decoded = decodeToken(token)
    if (!decoded?.exp) return 0
    
    const currentTime = Date.now() / 1000
    const timeRemaining = (decoded.exp - currentTime) * 1000
    
    return Math.max(0, timeRemaining)
  } catch (error) {
    console.error('❌ Error calculando tiempo restante del token:', error)
    return 0
  }
}

/**
 * Verifica si el token necesita renovación
 */
export const shouldRefreshToken = (token: string): boolean => {
  try {
    const timeRemaining = getTokenTimeRemaining(token)
    return timeRemaining < TOKEN_CONFIG.AUTO_REFRESH_THRESHOLD
  } catch (error) {
    console.error('❌ Error verificando si necesita renovación:', error)
    return true
  }
}

// ==========================================
// GESTIÓN DE DATOS DE USUARIO
// ==========================================

/**
 * Guarda los datos del usuario
 */
export const setUserData = (userData: UserData): boolean => {
  console.log('👤 Guardando datos de usuario...')
  try {
    const userString = JSON.stringify(userData)
    return setStorageItem(STORAGE_KEYS.USER, userString)
  } catch (error) {
    console.error('❌ Error guardando datos de usuario:', error)
    return false
  }
}

/**
 * Obtiene los datos del usuario
 */
export const getUserData = (): UserData | null => {
  try {
    const userString = getStorageItem(STORAGE_KEYS.USER)
    if (!userString) return null
    
    return JSON.parse(userString) as UserData
  } catch (error) {
    console.error('❌ Error obteniendo datos de usuario:', error)
    return null
  }
}

/**
 * Elimina los datos del usuario
 */
export const removeUserData = (): boolean => {
  console.log('🗑️ Eliminando datos de usuario...')
  return removeStorageItem(STORAGE_KEYS.USER)
}

/**
 * Extrae datos del usuario desde el token - CORREGIDO
 */
export const getUserFromToken = (token: string): UserData | null => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.userId) return null
    
    return {
      userId: decoded.userId,
      empresaId: decoded.empresaId || null,
      nombre: decoded.nombre || '',
      email: decoded.email || '',
      rol: decoded.rol || 'usuario',
      photo: decoded.photo || undefined,
      img: decoded.img || undefined
    }
  } catch (error) {
    console.error('❌ Error extrayendo usuario del token:', error)
    return null
  }
}

// ==========================================
// HEADERS DE AUTENTICACIÓN
// ==========================================

/**
 * Genera los headers de autenticación para requests
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken()
  
  if (!token || !isTokenValid(token)) {
    console.warn('⚠️ Token inválido o no encontrado para headers')
    return {}
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

/**
 * Alias para mantener compatibilidad
 */
export const getAuthHeader = getAuthHeaders

// ==========================================
// GESTIÓN COMPLETA DE SESIÓN
// ==========================================

/**
 * Establece una sesión completa (token + usuario)
 */
export const setSession = (token: string, userData?: UserData, refreshToken?: string): boolean => {
  console.log('🔐 Estableciendo sesión completa...')
  
  try {
    // Guardar token principal
    if (!setToken(token)) {
      throw new Error('Error guardando token principal')
    }
    
    // Guardar refresh token si se proporciona
    if (refreshToken && !setRefreshToken(refreshToken)) {
      console.warn('⚠️ Error guardando refresh token')
    }
    
    // Guardar datos de usuario (del parámetro o extraer del token)
    const finalUserData = userData || getUserFromToken(token)
    if (finalUserData && !setUserData(finalUserData)) {
      console.warn('⚠️ Error guardando datos de usuario')
    }
    
    console.log('✅ Sesión establecida correctamente')
    return true
    
  } catch (error) {
    console.error('❌ Error estableciendo sesión:', error)
    clearSession()
    return false
  }
}

/**
 * Limpia toda la sesión
 */
export const clearSession = (): void => {
  console.log('🧹 Limpiando sesión completa...')
  
  removeToken()
  removeRefreshToken()
  removeUserData()
  removeStorageItem(STORAGE_KEYS.REMEMBER_ME)
  
  console.log('✅ Sesión limpiada correctamente')
}

/**
 * Verifica si hay una sesión activa válida
 */
export const hasValidSession = (): boolean => {
  const token = getToken()
  const userData = getUserData()
  
  return !!(token && isTokenValid(token) && userData?.userId)
}

/**
 * Obtiene información completa de la sesión
 */
export const getSessionInfo = () => {
  const token = getToken()
  const userData = getUserData()
  const refreshToken = getRefreshToken()
  
  return {
    token,
    userData,
    refreshToken,
    isValid: hasValidSession(),
    tokenTimeRemaining: token ? getTokenTimeRemaining(token) : 0,
    shouldRefresh: token ? shouldRefreshToken(token) : false
  }
}

// ==========================================
// ALIASES PARA COMPATIBILIDAD
// ==========================================

// Aliases para tokenStore.ts
export const setAccessToken = setToken
export const getAccessToken = getToken
export const removeAccessToken = removeToken

// ==========================================
// UTILIDADES DE DEBUG
// ==========================================

/**
 * Imprime información de debug de la sesión
 */
export const debugSession = (): void => {
  if (process.env.NODE_ENV !== 'development') return
  
  console.group('🔍 Debug de Sesión - Bendito Calzado')
  
  const sessionInfo = getSessionInfo()
  console.log('Token presente:', !!sessionInfo.token)
  console.log('Usuario presente:', !!sessionInfo.userData)
  console.log('Sesión válida:', sessionInfo.isValid)
  
  if (sessionInfo.token) {
    console.log('Tiempo restante:', Math.round(sessionInfo.tokenTimeRemaining / 1000), 'segundos')
    console.log('Necesita renovación:', sessionInfo.shouldRefresh)
  }
  
  if (sessionInfo.userData) {
    console.log('Usuario:', sessionInfo.userData.nombre)
    console.log('Email:', sessionInfo.userData.email)
    console.log('Empresa ID:', sessionInfo.userData.empresaId)
  }
  
  console.groupEnd()
}

// ==========================================
// EXPORT DEFAULT - CORREGIDO
// ==========================================

const authSystem = {
  // Gestión de tokens
  setToken,
  getToken,
  removeToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  
  // Validación
  isTokenValid,
  isTokenExpired,
  shouldRefreshToken,
  getTokenTimeRemaining,
  decodeToken,
  
  // Datos de usuario
  setUserData,
  getUserData,
  removeUserData,
  getUserFromToken,
  
  // Headers
  getAuthHeaders,
  getAuthHeader,
  
  // Sesión completa
  setSession,
  clearSession,
  hasValidSession,
  getSessionInfo,
  
  // Utilidades
  debugSession,
  
  // Aliases
  setAccessToken,
  getAccessToken,
  removeAccessToken
}

export default authSystem