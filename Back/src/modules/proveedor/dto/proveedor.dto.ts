// ✅ src/modules/proveedor/dto/proveedor.dto.ts
export interface CrearProveedorDTO {
  nombre: string
  nit: string
  direccion?: string
  telefono?: string
  email?: string
  empresaId: number // ✅ requerido para vincular empresa
}
