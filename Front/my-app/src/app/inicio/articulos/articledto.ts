export interface Articulo {
  id: number
  nombre: string
  codigo: string
  descripcion?: string
  precio: number
  empresaId: number
  fotoPrincipal?: string
  createdAt: string
  updatedAt: string
     
  // ✅ CORREGIDO: Relaciones según tu esquema de Prisma
  fotos?: Foto[]
  articuloValores?: ArticuloValor[]  // Tabla intermedia (no valoresVariante)
  precios?: PrecioArticulo[]
  empresa?: {
    id: number
    nombre: string
  }
}

export interface Foto {
  id: number
  url: string
  articuloId: number
  publicId?: string  // Para Cloudinary
  orden?: number     // Orden de las fotos
}

// ✅ NUEVO: Interface para la tabla intermedia ArticuloVariante
export interface ArticuloValor {
  id: number
  articuloId: number
  valorId: number        // ✅ CORREGIDO: valorId (no valorVarianteId)
  valor?: ValorVariante  // Relación con ValorVariante
}

// ✅ CORREGIDO: ValorVariante según tu esquema
export interface ValorVariante {
  id: number
  nombre: string         // ✅ CORREGIDO: nombre (no valor)
  tipoVarianteId: number
  // ❌ REMOVIDO: articuloId (no existe en tu modelo)
  tipoVariante?: TipoVariante
}

// ✅ NUEVO: Interface para TipoVariante
export interface TipoVariante {
  id: number
  nombre: string
}

export interface PrecioArticulo {
  id: number
  valor: number
  tipoPrecioId: number
  articuloId: number
  tipoPrecio?: {
    id: number
    nombre: string
  }
}

export interface CrearArticuloDto {
  nombre: string
  descripcion?: string
  precio: number
  variantes?: { tipoVarianteId: number; valor: string }[]
  precios?: { tipoPrecioId: number; valor: number }[]
}

export interface ActualizarArticuloDto {
  nombre?: string
  descripcion?: string
  precio?: number
  fotoPrincipal?: string
  variantes?: { tipoVarianteId: number; valor: string }[]
  precios?: { tipoPrecioId: number; valor: number }[]
}