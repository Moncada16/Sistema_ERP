export interface CrearArticuloDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  empresaId: number;
}

export interface CrearVarianteDTO {
  nombre: string;
  articuloId: number;
}
