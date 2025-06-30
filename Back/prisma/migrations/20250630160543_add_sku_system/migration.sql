/*
  Warnings:

  - You are about to drop the column `varianteId` on the `CompraDetalle` table. All the data in the column will be lost.
  - You are about to drop the `Inventario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variante` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[numero]` on the table `Compra` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numero` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skuId` to the `CompraDetalle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoCompra" AS ENUM ('PENDIENTE', 'RECIBIDA', 'CANCELADA');

-- DropForeignKey
ALTER TABLE "ArticuloVariante" DROP CONSTRAINT "ArticuloVariante_articuloId_fkey";

-- DropForeignKey
ALTER TABLE "CompraDetalle" DROP CONSTRAINT "CompraDetalle_compraId_fkey";

-- DropForeignKey
ALTER TABLE "CompraDetalle" DROP CONSTRAINT "CompraDetalle_varianteId_fkey";

-- DropForeignKey
ALTER TABLE "Foto" DROP CONSTRAINT "Foto_articuloId_fkey";

-- DropForeignKey
ALTER TABLE "Inventario" DROP CONSTRAINT "Inventario_bodegaId_fkey";

-- DropForeignKey
ALTER TABLE "Inventario" DROP CONSTRAINT "Inventario_varianteId_fkey";

-- DropForeignKey
ALTER TABLE "Variante" DROP CONSTRAINT "Variante_articuloId_fkey";

-- AlterTable
ALTER TABLE "Articulo" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "estado" "EstadoCompra" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CompraDetalle" DROP COLUMN "varianteId",
ADD COLUMN     "descuento" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "skuId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PrecioArticulo" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "margen" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "TipoPrecio" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "descripcion" TEXT;

-- AlterTable
ALTER TABLE "TipoVariante" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "orden" INTEGER;

-- AlterTable
ALTER TABLE "ValorVariante" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "hexColor" TEXT,
ADD COLUMN     "imagen" TEXT,
ADD COLUMN     "orden" INTEGER;

-- DropTable
DROP TABLE "Inventario";

-- DropTable
DROP TABLE "Variante";

-- CreateTable
CREATE TABLE "ArticuloSku" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "codigoBarras" TEXT,
    "articuloId" INTEGER NOT NULL,
    "precioBase" DOUBLE PRECISION,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticuloSku_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkuVariante" (
    "id" SERIAL NOT NULL,
    "skuId" INTEGER NOT NULL,
    "valorVarianteId" INTEGER NOT NULL,

    CONSTRAINT "SkuVariante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkuInventario" (
    "id" SERIAL NOT NULL,
    "skuId" INTEGER NOT NULL,
    "bodegaId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "minimo" INTEGER NOT NULL DEFAULT 0,
    "maximo" INTEGER,
    "ubicacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkuInventario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticuloSku_sku_key" ON "ArticuloSku"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ArticuloSku_codigoBarras_key" ON "ArticuloSku"("codigoBarras");

-- CreateIndex
CREATE INDEX "ArticuloSku_articuloId_idx" ON "ArticuloSku"("articuloId");

-- CreateIndex
CREATE INDEX "ArticuloSku_sku_idx" ON "ArticuloSku"("sku");

-- CreateIndex
CREATE INDEX "ArticuloSku_codigoBarras_idx" ON "ArticuloSku"("codigoBarras");

-- CreateIndex
CREATE INDEX "SkuVariante_skuId_idx" ON "SkuVariante"("skuId");

-- CreateIndex
CREATE UNIQUE INDEX "SkuVariante_skuId_valorVarianteId_key" ON "SkuVariante"("skuId", "valorVarianteId");

-- CreateIndex
CREATE INDEX "SkuInventario_skuId_idx" ON "SkuInventario"("skuId");

-- CreateIndex
CREATE INDEX "SkuInventario_bodegaId_idx" ON "SkuInventario"("bodegaId");

-- CreateIndex
CREATE UNIQUE INDEX "SkuInventario_skuId_bodegaId_key" ON "SkuInventario"("skuId", "bodegaId");

-- CreateIndex
CREATE UNIQUE INDEX "Compra_numero_key" ON "Compra"("numero");

-- CreateIndex
CREATE INDEX "CompraDetalle_compraId_idx" ON "CompraDetalle"("compraId");

-- CreateIndex
CREATE INDEX "CompraDetalle_skuId_idx" ON "CompraDetalle"("skuId");

-- CreateIndex
CREATE INDEX "ValorVariante_tipoVarianteId_idx" ON "ValorVariante"("tipoVarianteId");

-- AddForeignKey
ALTER TABLE "ArticuloSku" ADD CONSTRAINT "ArticuloSku_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkuVariante" ADD CONSTRAINT "SkuVariante_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "ArticuloSku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkuVariante" ADD CONSTRAINT "SkuVariante_valorVarianteId_fkey" FOREIGN KEY ("valorVarianteId") REFERENCES "ValorVariante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkuInventario" ADD CONSTRAINT "SkuInventario_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "ArticuloSku"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkuInventario" ADD CONSTRAINT "SkuInventario_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticuloVariante" ADD CONSTRAINT "ArticuloVariante_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraDetalle" ADD CONSTRAINT "CompraDetalle_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraDetalle" ADD CONSTRAINT "CompraDetalle_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "ArticuloSku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
