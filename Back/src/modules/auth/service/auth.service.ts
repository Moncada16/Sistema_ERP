import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../../prisma/client';

const SALT_ROUNDS = 10;

export async function registerUser(data: {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}) {
  const { nombre, email, telefono, password } = data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('El email ya está en uso');

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  return await prisma.user.create({
    data: {
      nombre,
      email,
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

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Contraseña incorrecta');

  let empresaId = user.empresaId;
//  if (!empresaId) empresaId = await assignEmpresaToUser(user);

  const token = jwt.sign(
    { userId: user.id, empresaId, rol: user.rol },
    process.env.JWT_SECRET as string,
    { expiresIn: '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      empresaId,
      createdAt: user.createdAt
    }
  };
}
