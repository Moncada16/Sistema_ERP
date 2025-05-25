// ✅ src/modules/proveedor/service/proveedor.service.ts
import prisma from '../../../../prisma/client'
import { CrearProveedorDTO } from '../dto/proveedor.dto'

export const crearProveedor = async (data: CrearProveedorDTO) => {
  return prisma.proveedor.create({
    data: {
      nombre: data.nombre,
      nit: data.nit,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email,
      empresa: {
        connect: { id: data.empresaId }
      }
    }
  })
}

export const obtenerProveedores = async (empresaId: number) => {
  return prisma.proveedor.findMany({
    where: { empresaId },
    orderBy: { nombre: 'asc' }
  })
}

export const actualizarProveedor = async (
  id: number,
  data: Partial<Omit<CrearProveedorDTO, 'empresaId'>>
) => {
  return prisma.proveedor.update({
    where: { id },
    data
  })
}

export const eliminarProveedor = async (id: number) => {
  return prisma.proveedor.delete({ where: { id } })
}
