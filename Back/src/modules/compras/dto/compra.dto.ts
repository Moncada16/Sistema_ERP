import { TipoPago } from '@prisma/client'
export interface CrearCompraDTO {
  proveedorId: number
  tipoPago: 'credito' | 'contado'
  bodegaId: number
  detalles: {
    varianteId: number
    cantidad: number
    valorCompra: number
    valorVenta: number
  }[]
}
