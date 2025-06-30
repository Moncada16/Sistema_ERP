// src/modules/articulo-sku/types/sku.types.ts

import { 
  ArticuloSku, 
  SkuVariante, 
  SkuInventario,
  Articulo,
  Bodega,
  CategoriaArticulo,
  // UnidadMedida,  
} from '@prisma/client';

// Tipos base extendidos
export interface ArticuloSkuCompleto extends ArticuloSku {
  articulo: Articulo & {
    categoria?: CategoriaArticulo | null;
    // unidad?: UnidadMedida | null;
  };
  variantes: SkuVariante[];
  inventarios: (SkuInventario & {
    bodega: Bodega;
  })[];
}

// DTOs para crear/actualizar
export interface CreateSkuDto {
  sku?: string;
  variantes?: string[];
  precio?: number;
  costo?: number;
  codigoBarras?: string;
  activo?: boolean;
}

export interface UpdateSkuDto {
  precio?: number;
  costo?: number;
  codigoBarras?: string;
  activo?: boolean;
}

export interface CreateVarianteDto {
  tipo: 'COLOR' | 'TALLA' | 'MATERIAL' | 'OTRO';
  valor: string;
  codigo?: string;
  orden?: number;
}

export interface UpdateInventarioDto {
  cantidad: number;
  minimo?: number;
  maximo?: number;
  ubicacion?: string;
}

// Tipos para búsqueda y filtros
export interface SkuFiltros {
  activo?: boolean;
  categoriaId?: number;
  bodegaId?: number;
  conStock?: boolean;
  bajoMinimo?: boolean;
  busqueda?: string;
}

export interface SkuBusquedaResultado {
  sku: ArticuloSkuCompleto;
  tipo: 'SKU' | 'CODIGO_BARRAS';
  coincidencia: string;
}

// Tipos para reportes
export interface SkuReporte {
  fecha: Date;
  bodega: string;
  totalItems: number;
  totalUnidades: number;
  valorTotal: number;
  items: SkuReporteItem[];
}

export interface SkuReporteItem {
  sku: string;
  codigoBarras: string;
  nombre: string;
  variantes: string;
  bodega: string;
  ubicacion: string;
  cantidad: number;
  minimo: number;
  maximo: number;
  precio: number;
  costo: number;
  valorInventario: number;
}

// Tipos para estadísticas
export interface SkuEstadisticas {
  totalSkus: number;
  skusActivos: number;
  skusSinStock: number;
  skusBajoMinimo: number;
  valorInventario: number;
  topProductos: {
    sku: string;
    nombre: string;
    cantidad: number;
  }[];
}

// Tipos para importación/exportación
export interface ImportSkuData {
  sku: string;
  codigo_articulo?: string;
  codigo_barras?: string;
  precio?: string;
  costo?: string;
  color?: string;
  talla?: string;
  stock?: string;
  stock_minimo?: string;
  stock_maximo?: string;
  bodega_id?: string;
  ubicacion?: string;
  activo?: string;
  exito?: boolean;
  error?: string;
}

// Tipos para e-commerce
export interface FeedProducto {
  id: string;
  sku: string;
  titulo: string;
  descripcion: string;
  precio: number;
  precioComparacion: number;
  codigoBarras: string;
  peso: number;
  categoria: string;
  subcategoria: string;
  marca: string;
  stock: number;
  disponible: boolean;
  variantes: Record<string, string>;
  imagenes: string[];
  seo: {
    titulo: string;
    descripcion: string;
    palabrasClave: string[];
  };
}

// Tipos para migración
export interface SkuMigracionResultado {
  articulosProcesados: number;
  skusCreados: number;
  skusActualizados: number;
  errores: number;
  detalles: string[];
}

// Tipos para precios por tipo
export interface SkuPrecioTipo {
  skuId: number;
  tipo: 'PUBLICO' | 'MAYORISTA' | 'DISTRIBUIDOR' | 'ESPECIAL';
  precio: number;
  moneda?: string;
  activo: boolean;
}

// Tipos para movimientos de inventario
export interface MovimientoInventarioSku {
  skuId: number;
  bodegaOrigenId?: number;
  bodegaDestinoId?: number;
  tipo: 'ENTRADA' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE';
  cantidad: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  motivo: string;
  referencia?: string;
  usuarioId: number;
  fecha: Date;
}

// Tipos para respuestas de API
export interface SkuResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SkuPaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}