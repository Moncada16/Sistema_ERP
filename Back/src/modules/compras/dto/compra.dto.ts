import { TipoPago } from '@prisma/client'
export interface CrearCompraDTO {
  numero: string
  proveedorId: number
  tipoPago: 'credito' | 'contado'
  bodegaId: number
  ubicacion?: string // Opcional, si no se maneja ubicación, puedes eliminarlo
  detalles: {
    varianteId: number
    cantidad: number
    valorCompra: number
    valorVenta: number
    ubicacion?: string// Opcional, si no se maneja ubicación, puedes eliminarlo
  }[]
}
