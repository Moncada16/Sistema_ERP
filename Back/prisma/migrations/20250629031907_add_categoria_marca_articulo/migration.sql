-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('contado', 'credito');

-- CreateEnum
CREATE TYPE "EstadoCuentaPorPagar" AS ENUM ('PENDIENTE', 'PAGADA', 'VENCIDA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "img" TEXT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'gerente',
    "empresaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imgPublicId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "moneda" TEXT NOT NULL,
    "zonaHoraria" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bodega" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bodega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_articulos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "icono" TEXT,
    "empresaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_articulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "logo" TEXT,
    "empresaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articulo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "categoriaId" INTEGER,
    "marcaId" INTEGER,
    "fotoPrincipal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoPrecio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TipoPrecio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrecioArticulo" (
    "id" SERIAL NOT NULL,
    "articuloId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,
    "tipoPrecioId" INTEGER NOT NULL,

    CONSTRAINT "PrecioArticulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "articuloId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Variante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "orden" INTEGER,
    "articuloId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Foto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "id" SERIAL NOT NULL,
    "varianteId" INTEGER NOT NULL,
    "bodegaId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoVariante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoVariante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValorVariante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoVarianteId" INTEGER NOT NULL,

    CONSTRAINT "ValorVariante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticuloVariante" (
    "id" SERIAL NOT NULL,
    "articuloId" INTEGER NOT NULL,
    "valorId" INTEGER NOT NULL,

    CONSTRAINT "ArticuloVariante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" SERIAL NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "tipoPago" "TipoPago" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bodegaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompraDetalle" (
    "id" SERIAL NOT NULL,
    "compraId" INTEGER NOT NULL,
    "varianteId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "valorCompra" DOUBLE PRECISION NOT NULL,
    "valorVenta" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CompraDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuentaPorPagar" (
    "id" SERIAL NOT NULL,
    "compraId" INTEGER NOT NULL,
    "saldoTotal" DOUBLE PRECISION NOT NULL,
    "saldoPendiente" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoCuentaPorPagar" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentaPorPagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbonoCuenta" (
    "id" SERIAL NOT NULL,
    "cuentaPorPagarId" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AbonoCuenta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_telefono_key" ON "User"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nit_key" ON "Empresa"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_articulos_nombre_empresaId_key" ON "categorias_articulos"("nombre", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_nombre_empresaId_key" ON "marcas"("nombre", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Articulo_codigo_key" ON "Articulo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "TipoPrecio_nombre_key" ON "TipoPrecio"("nombre");

-- CreateIndex
CREATE INDEX "PrecioArticulo_articuloId_idx" ON "PrecioArticulo"("articuloId");

-- CreateIndex
CREATE UNIQUE INDEX "PrecioArticulo_articuloId_tipoPrecioId_key" ON "PrecioArticulo"("articuloId", "tipoPrecioId");

-- CreateIndex
CREATE UNIQUE INDEX "Variante_sku_key" ON "Variante"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Foto_publicId_key" ON "Foto"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventario_varianteId_bodegaId_key" ON "Inventario"("varianteId", "bodegaId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoVariante_nombre_key" ON "TipoVariante"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ArticuloVariante_articuloId_valorId_key" ON "ArticuloVariante"("articuloId", "valorId");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_nit_key" ON "Proveedor"("nit");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bodega" ADD CONSTRAINT "Bodega_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_articulos" ADD CONSTRAINT "categorias_articulos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marcas" ADD CONSTRAINT "marcas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articulo" ADD CONSTRAINT "Articulo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articulo" ADD CONSTRAINT "Articulo_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias_articulos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articulo" ADD CONSTRAINT "Articulo_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrecioArticulo" ADD CONSTRAINT "PrecioArticulo_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrecioArticulo" ADD CONSTRAINT "PrecioArticulo_tipoPrecioId_fkey" FOREIGN KEY ("tipoPrecioId") REFERENCES "TipoPrecio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variante" ADD CONSTRAINT "Variante_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "Variante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValorVariante" ADD CONSTRAINT "ValorVariante_tipoVarianteId_fkey" FOREIGN KEY ("tipoVarianteId") REFERENCES "TipoVariante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticuloVariante" ADD CONSTRAINT "ArticuloVariante_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "Articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticuloVariante" ADD CONSTRAINT "ArticuloVariante_valorId_fkey" FOREIGN KEY ("valorId") REFERENCES "ValorVariante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraDetalle" ADD CONSTRAINT "CompraDetalle_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraDetalle" ADD CONSTRAINT "CompraDetalle_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "Variante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proveedor" ADD CONSTRAINT "Proveedor_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaPorPagar" ADD CONSTRAINT "CuentaPorPagar_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbonoCuenta" ADD CONSTRAINT "AbonoCuenta_cuentaPorPagarId_fkey" FOREIGN KEY ("cuentaPorPagarId") REFERENCES "CuentaPorPagar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
