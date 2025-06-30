// src/app/inicio/articulos/articledto.ts

export interface Articulo {
  id: number
  nombre: string
  codigo: string
  descripcion?: string
  precio: number
  empresaId: number
  categoriaId?: number | null    // ← NUEVO: ID de categoría
  marcaId?: number | null        // ← NUEVO: ID de marca
  fotoPrincipal?: string
  createdAt: string
  updatedAt: string
  
  // Relaciones
  empresa?: {
    id: number
    nombre: string
  }
  categoria?: {                  // ← NUEVA: Relación con categoría
    id: number
    nombre: string
    icono?: string
  }
  marca?: {                      // ← NUEVA: Relación con marca
    id: number
    nombre: string
    logo?: string
  }
  articuloValores?: ArticuloVariante[]
  fotos?: Foto[]
  precios?: PrecioArticulo[]
  variantes?: Variante[]
}

export interface CrearArticuloDto {
  nombre: string
  descripcion?: string
  precio: number
  categoriaId?: number | null    // ← NUEVO: Campo opcional para categoría
  marcaId?: number | null        // ← NUEVO: Campo opcional para marca
}

export interface ActualizarArticuloDto {
  nombre?: string
  descripcion?: string
  precio?: number
  categoriaId?: number | null    // ← NUEVO: Campo opcional para categoría
  marcaId?: number | null        // ← NUEVO: Campo opcional para marca
}

// Interfaces auxiliares
export interface ArticuloVariante {
  id: number
  articuloId: number
  valorId: number
  valor?: {
    id: number
    nombre: string
    tipoVarianteId: number
    tipoVariante?: {
      id: number
      nombre: string
    }
  }
}

export interface Foto {
  id: number
  url: string
  publicId: string
  orden?: number
  articuloId: number
}

export interface PrecioArticulo {
  id: number
  articuloId: number
  valor: number
  tipoPrecioId: number
  tipoPrecio?: {
    id: number
    nombre: string
  }
}

export interface Variante {
  id: number
  nombre: string
  sku: string
  articuloId: number
  createdAt: string
  updatedAt: string
}