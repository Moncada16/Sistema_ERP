// DTO principal para crear un artículo
export interface CrearArticuloDTO {
  nombre: string
  descripcion?: string
  precio: number
  empresaId: number
  codigo?: string
  fotoUrl?: string

  // Nuevos campos para crear relaciones
  variantes?: CrearValorVarianteDTO[]
  precios?: CrearPrecioArticuloDTO[]
}

// Valor de variante asociada a un tipo de variante
export interface CrearValorVarianteDTO {
  tipoVarianteId: number
  valor: string
}

// Precio adicional asociado a un tipo de precio
export interface CrearPrecioArticuloDTO {
  tipoPrecioId: number
  valor: number
}
