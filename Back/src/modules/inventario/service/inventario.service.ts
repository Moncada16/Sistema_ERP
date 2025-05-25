
import prisma from '../../../../prisma/client';



 export const asignarInventario = async (varianteId: number, bodegaId: number, cantidad: number) => {
   return await prisma.inventario.upsert({
     where: { varianteId_bodegaId: { varianteId, bodegaId } },
     update: { cantidad },
     create: { varianteId, bodegaId, cantidad }
   })
 }

 export const verInventarioPorVariante = async (varianteId: number) => {
   return await prisma.inventario.findMany({
     where: { varianteId },
     include: {
       bodega: { select: { id: true, nombre: true, direccion: true } }
     }
   })
 }
