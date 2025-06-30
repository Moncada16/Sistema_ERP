// src/modules/articulo-sku/service/sku-additional.service.ts

import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import {
  ImportSkuData,
  SkuReporte,
  SkuEstadisticas,
  FeedProducto,
  SkuMigracionResultado
} from '../types/sku.types';

export class SkuAdditionalService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Importar SKUs desde CSV
   */
  async importarSkus(csvData: string): Promise<ImportSkuData[]> {
    try {
      // Parsear CSV
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      const resultados: ImportSkuData[] = [];

      for (const record of records) {
        try {
          // Buscar artículo
          const articulo = await this.prisma.articulo.findFirst({
            where: { 
              codigo: record.codigo_articulo 
            }
          });

          if (!articulo) {
            resultados.push({
              sku: record.sku,
              exito: false,
              error: `Artículo no encontrado: ${record.codigo_articulo}`
            });
            continue;
          }

          // Buscar valores de variantes
          const valorVarianteIds: number[] = [];
          
          if (record.color) {
            const valorColor = await this.prisma.valorVariante.findFirst({
              where: {
                nombre: record.color,
                tipoVariante: {
                  nombre: 'Color'
                }
              }
            });
            if (valorColor) valorVarianteIds.push(valorColor.id);
          }

          if (record.talla) {
            const valorTalla = await this.prisma.valorVariante.findFirst({
              where: {
                nombre: record.talla,
                tipoVariante: {
                  nombre: 'Talla'
                }
              }
            });
            if (valorTalla) valorVarianteIds.push(valorTalla.id);
          }

          // Crear o actualizar SKU
          const skuData = {
            sku: record.sku,
            codigoBarras: record.codigo_barras || null,
            precioBase: parseFloat(record.precio) || null,
            activo: record.activo !== 'false',
            articuloId: articulo.id
          };

          const sku = await this.prisma.articuloSku.upsert({
            where: { sku: record.sku },
            create: skuData,
            update: skuData
          });

          // Crear relaciones con variantes
          for (const valorVarianteId of valorVarianteIds) {
            await this.prisma.skuVariante.upsert({
              where: {
                skuId_valorVarianteId: {
                  skuId: sku.id,
                  valorVarianteId
                }
              },
              create: {
                skuId: sku.id,
                valorVarianteId
              },
              update: {}
            });
          }

          // Actualizar inventario si se proporciona
          if (record.stock) {
            await this.prisma.skuInventario.upsert({
              where: {
                skuId_bodegaId_ubicacion: {
                  skuId: sku.id,
                  bodegaId: parseInt(record.bodega_id) || 1,
                  ubicacion: record.ubicacion || 'GENERAL'
                }
              },
              create: {
                skuId: sku.id,
                bodegaId: parseInt(record.bodega_id) || 1,
                ubicacion: record.ubicacion || 'GENERAL',
                cantidad: parseInt(record.stock) || 0,
                minimo: parseInt(record.stock_minimo) || 0,
                maximo: parseInt(record.stock_maximo) || 0
              },
              update: {
                cantidad: parseInt(record.stock) || 0
              }
            });
          }

          resultados.push({
            sku: record.sku,
            exito: true
          });

        } catch (error) {
          resultados.push({
            sku: record.sku,
            exito: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
          });
        }
      }

      return resultados;

    } catch (error) {
      throw new Error(`Error al importar SKUs: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Exportar inventario a CSV
   */
  async exportarInventario(filtros?: any): Promise<string> {
    const inventarios = await this.prisma.skuInventario.findMany({
      where: filtros,
      include: {
        sku: {
          include: {
            articulo: true,
            combinacion: {
              include: {
                valorVariante: {
                  include: {
                    tipoVariante: true
                  }
                }
              }
            }
          }
        },
        bodega: true
      }
    });

    const data = inventarios.map(inv => ({
      sku: inv.sku.sku,
      codigo_barras: inv.sku.codigoBarras,
      articulo: inv.sku.articulo.nombre,
      variantes: inv.sku.combinacion
        .map(v => `${v.valorVariante.tipoVariante.nombre}:${v.valorVariante.nombre}`)
        .join(', '),
      bodega: inv.bodega.nombre,
      ubicacion: inv.ubicacion,
      cantidad: inv.cantidad,
      minimo: inv.minimo,
      maximo: inv.maximo,
      precio: inv.sku.precioBase || inv.sku.articulo.precio,
      costo: inv.sku.articulo.precio,
      valor_inventario: inv.cantidad * inv.sku.articulo.precio
    }));

    return stringify(data, { header: true });
  }

  /**
   * Generar reporte de inventario
   */
  async generarReporteInventario(bodegaId?: number): Promise<SkuReporte> {
    const whereClause = bodegaId ? { bodegaId } : {};

    const inventarios = await this.prisma.skuInventario.findMany({
      where: whereClause,
      include: {
        sku: {
          include: {
            articulo: true,
            combinacion: {
              include: {
                valorVariante: {
                  include: {
                    tipoVariante: true
                  }
                }
              }
            }
          }
        },
        bodega: true
      }
    });

    const items = inventarios.map(inv => ({
      sku: inv.sku.sku,
      codigoBarras: inv.sku.codigoBarras || '',
      nombre: inv.sku.articulo.nombre,
      variantes: inv.sku.combinacion
        .map(v => `${v.valorVariante.tipoVariante.nombre}:${v.valorVariante.nombre}`)
        .join(', '),
      bodega: inv.bodega.nombre,
      ubicacion: inv.ubicacion,
      cantidad: inv.cantidad,
      minimo: inv.minimo,
      maximo: inv.maximo,
      precio: inv.sku.precioBase || inv.sku.articulo.precio,
      costo: inv.sku.articulo.precio,
      valorInventario: inv.cantidad * inv.sku.articulo.precio
    }));

    const totalItems = items.length;
    const totalUnidades = items.reduce((sum, item) => sum + item.cantidad, 0);
    const valorTotal = items.reduce((sum, item) => sum + item.valorInventario, 0);

    return {
      fecha: new Date(),
      bodega: bodegaId ? items[0]?.bodega || 'Sin bodega' : 'Todas',
      totalItems,
      totalUnidades,
      valorTotal,
      items
    };
  }

  /**
   * Obtener estadísticas de SKUs
   */
  async obtenerEstadisticas(): Promise<SkuEstadisticas> {
    const [
      totalSkus,
      skusActivos,
      skusSinStock,
      skusBajoMinimo,
      valorInventario
    ] = await Promise.all([
      this.prisma.articuloSku.count(),
      this.prisma.articuloSku.count({ where: { activo: true } }),
      this.prisma.skuInventario.count({ where: { cantidad: 0 } }),
      this.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count 
        FROM "SkuInventario" 
        WHERE cantidad < minimo AND minimo > 0
      `,
      this.prisma.$queryRaw<[{ total: number }]>`
        SELECT SUM(i.cantidad * a.precio) as total
        FROM "SkuInventario" i
        JOIN "ArticuloSku" s ON i."skuId" = s.id
        JOIN "Articulo" a ON s."articuloId" = a.id
      `
    ]);

    const topProductos = await this.prisma.articuloSku.findMany({
      take: 10,
      include: {
        articulo: true,
        inventario: {
          select: {
            cantidad: true
          }
        }
      },
      orderBy: {
        inventario: {
          _count: 'desc'
        }
      }
    });

    return {
      totalSkus,
      skusActivos,
      skusSinStock,
      skusBajoMinimo: Number(skusBajoMinimo[0].count),
      valorInventario: valorInventario[0]?.total || 0,
      topProductos: topProductos.map(p => ({
        sku: p.sku,
        nombre: p.articulo.nombre,
        cantidad: p.inventario.reduce((sum, inv) => sum + inv.cantidad, 0)
      }))
    };
  }

  /**
   * Generar feed para e-commerce
   */
  async generarFeedEcommerce(plataforma: 'SHOPIFY' | 'WOOCOMMERCE' | 'MERCADOLIBRE'): Promise<FeedProducto[]> {
    const skus = await this.prisma.articuloSku.findMany({
      where: { activo: true },
      include: {
        articulo: {
          include: {
            categoria: true,
            marca: true
          }
        },
        combinacion: {
          include: {
            valorVariante: {
              include: {
                tipoVariante: true
              }
            }
          }
        },
        inventario: true
      }
    });

    return skus.map(sku => {
      const stock = sku.inventario.reduce((sum, inv) => sum + inv.cantidad, 0);
      const variantes = sku.combinacion.reduce((acc, v) => {
        const tipoNombre = v.valorVariante.tipoVariante.nombre.toLowerCase();
        acc[tipoNombre] = v.valorVariante.nombre;
        return acc;
      }, {} as Record<string, string>);

      return {
        id: sku.id.toString(),
        sku: sku.sku,
        titulo: sku.articulo.nombre,
        descripcion: sku.articulo.descripcion || '',
        precio: sku.precioBase || sku.articulo.precio,
        precioComparacion: (sku.precioBase || sku.articulo.precio) * 1.2,
        codigoBarras: sku.codigoBarras || '',
        peso: 0,
        categoria: sku.articulo.categoria?.nombre || '',
        subcategoria: '',
        marca: sku.articulo.marca?.nombre || '',
        stock,
        disponible: stock > 0,
        variantes,
        imagenes: sku.articulo.fotoPrincipal ? [sku.articulo.fotoPrincipal] : [],
        seo: {
          titulo: sku.articulo.nombre,
          descripcion: sku.articulo.descripcion || '',
          palabrasClave: [
            sku.articulo.categoria?.nombre || '',
            sku.articulo.marca?.nombre || '',
            ...Object.values(variantes)
          ].filter(Boolean)
        }
      };
    });
  }

  /**
   * Migrar artículos existentes a SKUs
   */
  async migrarArticulosASku(): Promise<SkuMigracionResultado> {
    const articulos = await this.prisma.articulo.findMany({
      include: {
        skus: true,
        articuloValores: {
          include: {
            valor: true
          }
        }
      }
    });

    let creados = 0;
    let actualizados = 0;
    let errores = 0;
    const detalles: string[] = [];

    for (const articulo of articulos) {
      try {
        // Si ya tiene SKUs, saltar
        if (articulo.skus.length > 0) {
          detalles.push(`Artículo ${articulo.codigo} ya tiene ${articulo.skus.length} SKUs`);
          continue;
        }

        // Si el artículo tiene variantes, crear SKUs para cada combinación
        if (articulo.articuloValores.length > 0) {
          // Agrupar variantes por tipo
          const variantesPorTipo = articulo.articuloValores.reduce((acc, av) => {
            const tipoId = av.valor.tipoVarianteId;
            if (!acc[tipoId]) acc[tipoId] = [];
            acc[tipoId].push(av.valor);
            return acc;
          }, {} as Record<number, any[]>);

          // Generar todas las combinaciones
          const combinaciones = this.generarCombinaciones(Object.values(variantesPorTipo));

          for (const combinacion of combinaciones) {
            const codigoVariantes = combinacion
              .map(v => v.codigo || v.nombre.substring(0, 3).toUpperCase())
              .join('-');
            
            const skuCodigo = `${articulo.codigo}-${codigoVariantes}`;

            const skuCreado = await this.prisma.articuloSku.create({
              data: {
                sku: skuCodigo,
                codigoBarras: null,
                precioBase: articulo.precio,
                activo: articulo.activo,
                articuloId: articulo.id
              }
            });

            // Crear relaciones con variantes
            for (const valorVariante of combinacion) {
              await this.prisma.skuVariante.create({
                data: {
                  skuId: skuCreado.id,
                  valorVarianteId: valorVariante.id
                }
              });
            }

            creados++;
          }
        } else {
          // Crear SKU base sin variantes
          const skuBase = await this.prisma.articuloSku.create({
            data: {
              sku: articulo.codigo,
              codigoBarras: null,
              precioBase: articulo.precio,
              activo: articulo.activo,
              articuloId: articulo.id
            }
          });

          // Crear inventario inicial en bodega principal
          const bodegaPrincipal = await this.prisma.bodega.findFirst({
            where: { empresaId: articulo.empresaId }
          });

          if (bodegaPrincipal) {
            await this.prisma.skuInventario.create({
              data: {
                skuId: skuBase.id,
                bodegaId: bodegaPrincipal.id,
                ubicacion: 'GENERAL',
                cantidad: 0,
                minimo: 0,
                maximo: 0
              }
            });
          }

          creados++;
        }

        detalles.push(`✅ SKU(s) creado(s) para ${articulo.codigo}`);

      } catch (error) {
        errores++;
        detalles.push(`❌ Error en ${articulo.codigo}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    return {
      articulosProcesados: articulos.length,
      skusCreados: creados,
      skusActualizados: actualizados,
      errores,
      detalles
    };
  }

  /**
   * Función auxiliar para generar combinaciones de variantes
   */
  private generarCombinaciones(variantes: any[][]): any[][] {
    if (variantes.length === 0) return [[]];
    if (variantes.length === 1) return variantes[0].map(v => [v]);

    const resultado: any[][] = [];
    const primerTipo = variantes[0];
    const restoTipos = variantes.slice(1);
    const combinacionesResto = this.generarCombinaciones(restoTipos);

    for (const valor of primerTipo) {
      for (const combinacion of combinacionesResto) {
        resultado.push([valor, ...combinacion]);
      }
    }

    return resultado;
  }

  /**
   * Limpiar SKUs duplicados
   */
  async limpiarSkusDuplicados(): Promise<number> {
    // Buscar SKUs duplicados
    const duplicados = await this.prisma.$queryRaw<Array<{ sku: string; count: bigint }>>`
      SELECT sku, COUNT(*) as count
      FROM "ArticuloSku"
      GROUP BY sku
      HAVING COUNT(*) > 1
    `;

    let eliminados = 0;

    for (const dup of duplicados) {
      // Obtener todos los SKUs con ese código
      const skus = await this.prisma.articuloSku.findMany({
        where: { sku: dup.sku },
        orderBy: { createdAt: 'asc' },
        include: { inventario: true }
      });

      // Mantener el primero, eliminar el resto
      for (let i = 1; i < skus.length; i++) {
        // Primero eliminar inventarios relacionados
        await this.prisma.skuInventario.deleteMany({
          where: { skuId: skus[i].id }
        });

        // Eliminar relaciones con variantes
        await this.prisma.skuVariante.deleteMany({
          where: { skuId: skus[i].id }
        });

        // Luego eliminar el SKU
        await this.prisma.articuloSku.delete({
          where: { id: skus[i].id }
        });

        eliminados++;
      }
    }

    return eliminados;
  }

  /**
   * Sincronizar con plataforma externa
   */
  async sincronizarConPlataforma(
    plataforma: string,
    config: Record<string, any>
  ): Promise<{ exito: boolean; mensaje: string; detalles?: any }> {
    try {
      // Aquí implementarías la lógica específica de cada plataforma
      // Por ejemplo: Shopify API, WooCommerce API, etc.
      
      const feed = await this.generarFeedEcommerce(plataforma as any);
      
      // Simulación de sincronización
      return {
        exito: true,
        mensaje: `Sincronización con ${plataforma} completada`,
        detalles: {
          productosEnviados: feed.length,
          timestamp: new Date()
        }
      };

    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al sincronizar con ${plataforma}: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  /**
   * Actualizar stock masivo desde CSV
   */
  async actualizarStockMasivo(csvData: string): Promise<{ actualizados: number; errores: string[] }> {
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    let actualizados = 0;
    const errores: string[] = [];

    for (const record of records) {
      try {
        const sku = await this.prisma.articuloSku.findUnique({
          where: { sku: record.sku }
        });

        if (!sku) {
          errores.push(`SKU no encontrado: ${record.sku}`);
          continue;
        }

        await this.prisma.skuInventario.updateMany({
          where: {
            skuId: sku.id,
            bodegaId: parseInt(record.bodega_id) || 1
          },
          data: {
            cantidad: parseInt(record.cantidad),
            ...(record.minimo && { minimo: parseInt(record.minimo) }),
            ...(record.maximo && { maximo: parseInt(record.maximo) })
          }
        });

        actualizados++;
      } catch (error) {
        errores.push(`Error en SKU ${record.sku}: ${error instanceof Error ? error.message : 'Error'}`);
      }
    }

    return { actualizados, errores };
  }
}