// ============= TIPOS TYPESCRIPT =============
// src/types/categoria.types.ts

export interface CategoriaArticulo {
  id: number
  nombre: string
  descripcion?: string
  icono?: string
  empresaId: number
  createdAt: string
  updatedAt: string
  _count?: {
    articulos: number
  }
}

export interface CrearCategoriaDTO {
  nombre: string
  descripcion?: string
  icono?: string
}

// ============= ACTUALIZACIÓN DEL DTO DE ARTÍCULO =============
// Actualiza tu CrearArticuloDTO existente para incluir categoría

export interface CrearArticuloDTO {
  nombre: string
  descripcion?: string
  precio: number
  empresaId: number
  categoriaId?: number // ← NUEVO: ID de categoría opcional
}