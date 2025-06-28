import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../service/auth.service';

// 🔑 Tipos de error personalizados
class AuthError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'AuthError';
  }
}

class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends AuthError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

// 🛡️ Validaciones
const validateRegisterInput = (data: any) => {
  const { nombre, email, telefono, password, confirmPassword } = data;
  
  if (!nombre?.trim()) throw new ValidationError('El nombre es obligatorio');
  if (!email?.trim()) throw new ValidationError('El email es obligatorio');
  if (!telefono?.trim()) throw new ValidationError('El teléfono es obligatorio');
  if (!password) throw new ValidationError('La contraseña es obligatoria');
  if (!confirmPassword) throw new ValidationError('La confirmación de contraseña es obligatoria');
  if (password !== confirmPassword) throw new ValidationError('Las contraseñas no coinciden');
  
  return { nombre, email, telefono, password };
};

const validateLoginInput = (data: any) => {
  const { email, password } = data;
  
  if (!email?.trim()) throw new ValidationError('El email es obligatorio');
  if (!password) throw new ValidationError('La contraseña es obligatoria');
  
  return { email, password };
};

const JWT_SECRET = process.env.JWT_SECRET as string

// 🎫 Generación de token con más información
const generarAccessToken = (payload: { id: number; empresaId: number | null; rol: string; email: string }) => {
  return jwt.sign(
    {
      userId: payload.id,
      empresaId: payload.empresaId,
      rol: payload.rol,
      email: payload.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // 8 horas
    },
    JWT_SECRET
  );
};

// 📝 Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ Validar entrada
    const validatedData = validateRegisterInput(req.body);
    
    // 👤 Registrar usuario
    const user = await registerUser(validatedData);

    // 🎫 Generar token
    const token = generarAccessToken({
      id: user.id,
      empresaId: user.empresaId,
      rol: user.rol,
      email: user.email
    });

    // ✨ Respuesta exitosa
    res.status(201).json({
      message: 'Registro exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        empresaId: user.empresaId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    // ❌ Manejo de errores
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        error: error.message,
        type: error.name
      });
    } else {
      // 🔥 Error inesperado
      console.error('Error en registro:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        type: 'ServerError'
      });
    }
  }
};

// 🔐 Login de usuario
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ Validar entrada
    const validatedData = validateLoginInput(req.body);
    
    // 🔑 Intentar login
    const { token, user } = await loginUser(validatedData.email, validatedData.password);

    // ✨ Respuesta exitosa
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        empresaId: user.empresaId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    // ❌ Manejo de errores
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        error: error.message,
        type: error.name
      });
    } else {
      // 🔥 Error inesperado
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        type: 'ServerError'
      });
    }
  }
};

// 🚪 Logout de usuario
export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // En el futuro, aquí se podría implementar:
    // - Invalidación de token
    // - Limpieza de sesión
    // - Registro de logout
    res.status(200).json({
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      type: 'ServerError'
    });
  }
};
