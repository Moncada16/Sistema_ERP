
import prisma from '../../../../prisma/client';



 export const asignarInventario = async (varianteId: number, bodegaId: number, cantidad: number, ubicacion: string) => {
   return await prisma.skuInventario.upsert({
     where: { skuId_bodegaId_ubicacion: { skuId: varianteId, bodegaId, ubicacion } },
     update: { cantidad },
     create: { skuId: varianteId, bodegaId, cantidad, ubicacion },
   })
 }

 export const verInventarioPorVariante = async (varianteId: number) => {
   return await prisma.skuInventario.findMany({
     where: { skuId: varianteId },
     include: {
       bodega: { select: { id: true, nombre: true, direccion: true } }
     }
   })
 }
