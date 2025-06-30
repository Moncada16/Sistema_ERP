/*
  Warnings:

  - A unique constraint covering the columns `[skuId,bodegaId,ubicacion]` on the table `SkuInventario` will be added. If there are existing duplicate values, this will fail.
  - Made the column `maximo` on table `SkuInventario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ubicacion` on table `SkuInventario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SkuInventario" DROP CONSTRAINT "SkuInventario_skuId_fkey";

-- DropIndex
DROP INDEX "SkuInventario_bodegaId_idx";

-- DropIndex
DROP INDEX "SkuInventario_skuId_bodegaId_key";

-- DropIndex
DROP INDEX "SkuInventario_skuId_idx";

-- AlterTable
ALTER TABLE "SkuInventario" ALTER COLUMN "maximo" SET NOT NULL,
ALTER COLUMN "maximo" SET DEFAULT 0,
ALTER COLUMN "ubicacion" SET NOT NULL,
ALTER COLUMN "ubicacion" SET DEFAULT 'GENERAL';

-- CreateIndex
CREATE UNIQUE INDEX "SkuInventario_skuId_bodegaId_ubicacion_key" ON "SkuInventario"("skuId", "bodegaId", "ubicacion");

-- AddForeignKey
ALTER TABLE "SkuInventario" ADD CONSTRAINT "SkuInventario_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "ArticuloSku"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
