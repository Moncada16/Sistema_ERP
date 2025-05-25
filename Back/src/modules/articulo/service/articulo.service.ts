// import prisma from '../../../../prisma/client'

// export const crearArticulo = async (
//   empresaId: number,
//   nombre: string,
//   descripcion: string,
//   precio: number,
//   variantes: { tipoVarianteId: number; valor: string }[],
//   precios: { tipoPrecioId: number; valor: number }[]
// ) => {
//   const count = await prisma.articulo.count({ where: { empresaId } })
//   const codigo = `ART-${empresaId.toString().padStart(3, '0')}-${(count + 1).toString().padStart(4, '0')}`

//   return await prisma.articulo.create({
//     data: {
//       nombre,
//       descripcion,
//       precio,
//       codigo,
//       empresaId,
//       variantes: {
//         create: variantes.map(v => ({
//           valor: v.valor,
//           tipoVarianteId: v.tipoVarianteId
//         }))
//       },
//       tipoPrecios: {
//         create: precios.map(p => ({
//           valor: p.valor,
//           tipoPrecioId: p.tipoPrecioId
//         }))
//       }
//     },
//     include: {
//       variantes: {
//         include: {
//           tipoVariante: true // Esto solo si tipoVariante es una relación válida en ValorVariante
//         }
//       },
//       tipoPrecios: {
//         include: {
//           tipoPrecio: true // Esto solo si tipoPrecio es una relación válida en PrecioArticulo
//         }
//       }
//     }
//   })
// },

// export const listarArticulos = async (empresaId: number) => {
//   return await prisma.articulo.findMany({
//     where: { empresaId },
//     include: {
//       variantes: {
//         include: {
//           tipoVariante: true
//         }
//       },
//       tipoPrecios: {
//         include: {
//           tipoPrecio: true
//         }
//       }
//     }
//   })
// }

// export const obtenerArticuloPorId = async (id: number) => {
//   return await prisma.articulo.findUnique({
//     where: { id },
//     include: {
//       variantes: {
//         include: {
//           tipoVariante: true
//         }
//       },
//       tipoPrecios: {
//         include: {
//           tipoPrecio: true
//         }
//       }
//     }
//   })
// }

// export const actualizarArticulo = async (id: number, data: any) => {
//   return await prisma.articulo.update({
//     where: { id },
//     data
//   })
// }

// export const eliminarArticulo = async (id: number) => {
//   return await prisma.articulo.delete({
//     where: { id }
//   })
// }
