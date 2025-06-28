import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../../prisma/client';

const SALT_ROUNDS = 10;

// 🔒 Validación de contraseña
const validarPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// 📧 Validación de email
const validarEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// 📱 Validación de teléfono
const validarTelefono = (telefono: string): boolean => {
  const telefonoRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return telefonoRegex.test(telefono);
};

export async function registerUser(data: {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}) {
  const { nombre, email, telefono, password } = data;

  // ✅ Validaciones
  if (!validarEmail(email)) {
    throw new Error('Formato de email inválido');
  }

  if (!validarPassword(password)) {
    throw new Error('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales');
  }

  if (!validarTelefono(telefono)) {
    throw new Error('Formato de teléfono inválido');
  }

  // 🔍 Verificar si el email ya existe
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new Error('El email ya está registrado');
  }

  // 🔍 Verificar si el teléfono ya existe
  const telefonoExists = await prisma.user.findUnique({ where: { telefono } });
  if (telefonoExists) {
    throw new Error('El teléfono ya está registrado');
  }

  // 🔐 Encriptar contraseña
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  // 👤 Crear usuario
  return await prisma.user.create({
    data: {
      nombre,
      email: email.toLowerCase(),
      telefono,
      password: hash,
      rol: 'gerente'
    }
  });
}

//async function assignEmpresaToUser(user: any): Promise<number> {
//  const nuevaEmpresa = await prisma.empresa.create({
//    data: {
//      nombre: `${user.nombre} S.A.`,
//      nit: 'N/A',
//      direccion: '',
//      ciudad: '',
//      telefono: user.telefono,
//      email: user.email,
//      moneda: 'COP',
//      zonaHoraria: 'America/Bogota'
//    }
//  });

//  await prisma.bodega.create({
//    data: {
//      nombre: 'Bodega Principal',
//      direccion: nuevaEmpresa.direccion,
//      empresaId: nuevaEmpresa.id
//    }
//  });

//  const updatedUser = await prisma.user.update({
//    where: { id: user.id },
//    data: { empresaId: nuevaEmpresa.id }
//  });

//  return updatedUser.empresaId!;
//}

// 🔑 Intentos de inicio de sesión fallidos
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutos en milisegundos

interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

export async function loginUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();

  // 🔒 Verificar bloqueo por intentos fallidos
  const attempt = loginAttempts.get(normalizedEmail) || { count: 0, lastAttempt: Date.now() };
  
  if (attempt.lockedUntil && attempt.lockedUntil > Date.now()) {
    const remainingTime = Math.ceil((attempt.lockedUntil - Date.now()) / 1000 / 60);
    throw new Error(`Cuenta bloqueada. Intente nuevamente en ${remainingTime} minutos`);
  }

  // 👤 Buscar usuario
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // 🔐 Verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    attempt.count++;
    attempt.lastAttempt = Date.now();

    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      attempt.lockedUntil = Date.now() + LOCK_TIME;
      loginAttempts.set(normalizedEmail, attempt);
      throw new Error(`Demasiados intentos fallidos. Cuenta bloqueada por ${LOCK_TIME/1000/60} minutos`);
    }

    loginAttempts.set(normalizedEmail, attempt);
    throw new Error(`Credenciales inválidas. Intentos restantes: ${MAX_LOGIN_ATTEMPTS - attempt.count}`);
  }

  // ✅ Login exitoso, reiniciar contador
  loginAttempts.delete(normalizedEmail);

  // 🎫 Generar token con más información
  const token = jwt.sign(
    {
      userId: user.id,
      empresaId: user.empresaId,
      rol: user.rol,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // 8 horas
    },
    process.env.JWT_SECRET as string
  );

  // 📝 Registrar último acceso
  await prisma.user.update({
    where: { id: user.id },
    data: { updatedAt: new Date() }
  });

  return {
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
  };
}
