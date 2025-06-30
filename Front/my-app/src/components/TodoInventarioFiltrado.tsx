'use client'

import { useEffect, useState } from 'react'
import { FiArchive, FiFilter, FiBox, FiHome, FiTarget, FiBarChart2, FiPackage, FiLayers } from 'react-icons/fi'
import api from '@/app/lib/api'

type Registro = {
 cantidad: number
 bodega: { id: number; nombre: string }
 variante: {
   nombre: string
   articulo: { id: number; nombre: string }
   valores?: { nombre: string }[]
 }
}

export default function TodoInventarioFiltrado() {
 const [datos, setDatos] = useState<Registro[]>([])
 const [filtroArticulo, setFiltroArticulo] = useState('')
 const [filtroBodega, setFiltroBodega] = useState('')
 const [filtroValorVariante, setFiltroValorVariante] = useState('')
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState('')

 useEffect(() => {
   setLoading(true)
   api.get('/inventario/todo')
     .then((res) => {
       setDatos(res.data)
       setError('')
     })
     .catch((err) => {
       console.error('❌ Inventario error:', err)
       setError('Error al cargar el inventario')
     })
     .finally(() => setLoading(false))
 }, [])

 // 🔄 Generar filtros únicos
 const articulos = Array.from(
   new Set(datos.map((d) => `${d.variante.articulo.id}-${d.variante.articulo.nombre}`))
 )
 const bodegas = Array.from(new Set(datos.map((d) => `${d.bodega.id}-${d.bodega.nombre}`)))
 const valoresVariante = Array.from(
   new Set(
     datos.flatMap((d) => d.variante.valores?.map((v) => v.nombre) || [])
   )
 )

 // 🔎 Filtrado avanzado
 const filtrado = datos.filter((d) => {
   const articuloMatch =
     filtroArticulo === '' ||
     `${d.variante.articulo.id}-${d.variante.articulo.nombre}` === filtroArticulo

   const bodegaMatch =
     filtroBodega === '' ||
     `${d.bodega.id}-${d.bodega.nombre}` === filtroBodega

   const valorMatch =
     filtroValorVariante === '' ||
     (d.variante.valores?.some((v) => v.nombre === filtroValorVariante) ?? false)

   return articuloMatch && bodegaMatch && valorMatch
 })

 // Calcular estadísticas
 const totalArticulos = new Set(datos.map(d => d.variante.articulo.id)).size
 const totalBodegas = new Set(datos.map(d => d.bodega.id)).size
 const totalInventario = datos.reduce((sum, item) => sum + item.cantidad, 0)
 const inventarioFiltrado = filtrado.reduce((sum, item) => sum + item.cantidad, 0)

 const clearFilters = () => {
   setFiltroArticulo('')
   setFiltroBodega('')
   setFiltroValorVariante('')
 }

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 p-6">
       <div className="max-w-7xl mx-auto">
         <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl shadow-lg p-8 text-white mb-8">
           <div className="flex items-center">
             <FiArchive className="w-10 h-10 mr-4 animate-pulse" />
             <div>
               <h1 className="text-3xl font-bold">Inventario General</h1>
               <p className="text-amber-100 mt-2">Cargando datos del inventario...</p>
             </div>
           </div>
         </div>
         <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
         </div>
       </div>
     </div>
   )
 }

 if (error) {
   return (
     <div className="min-h-screen bg-gray-50 p-6">
       <div className="max-w-7xl mx-auto">
         <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg p-8 text-white mb-8">
           <div className="flex items-center">
             <FiArchive className="w-10 h-10 mr-4" />
             <div>
               <h1 className="text-3xl font-bold">Error en Inventario</h1>
               <p className="text-red-100 mt-2">{error}</p>
             </div>
           </div>
         </div>
       </div>
     </div>
   )
 }

 return (
   <div className="min-h-screen bg-gray-50 p-6">
     <div className="max-w-7xl mx-auto space-y-8">
       {/* Header con estadísticas */}
       <div className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl shadow-lg p-8 text-white">
         <div className="flex items-center justify-between">
           <div className="flex items-center">
             <FiArchive className="w-10 h-10 mr-4" />
             <div>
               <h1 className="text-3xl font-bold">Inventario General</h1>
               <p className="text-amber-100 mt-2">Gestión completa del inventario con filtros avanzados</p>
             </div>
           </div>
           <div className="text-right">
             <div className="text-2xl font-bold">{filtrado.length}</div>
             <div className="text-amber-100">registros</div>
           </div>
         </div>

         {/* Estadísticas rápidas */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
           <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
             <div className="flex items-center">
               <FiBox className="w-6 h-6 mr-3" />
               <div>
                 <div className="text-2xl font-bold">{totalArticulos}</div>
                 <div className="text-amber-100 text-sm">Artículos</div>
               </div>
             </div>
           </div>
           <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
             <div className="flex items-center">
               <FiHome className="w-6 h-6 mr-3" />
               <div>
                 <div className="text-2xl font-bold">{totalBodegas}</div>
                 <div className="text-amber-100 text-sm">Bodegas</div>
               </div>
             </div>
           </div>
           <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
             <div className="flex items-center">
               <FiBarChart2 className="w-6 h-6 mr-3" />
               <div>
                 <div className="text-2xl font-bold">{totalInventario}</div>
                 <div className="text-amber-100 text-sm">Total Stock</div>
               </div>
             </div>
           </div>
           <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
             <div className="flex items-center">
               <FiTarget className="w-6 h-6 mr-3" />
               <div>
                 <div className="text-2xl font-bold">{inventarioFiltrado}</div>
                 <div className="text-amber-100 text-sm">Stock Filtrado</div>
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Panel de filtros */}
       <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
         <div className="flex items-center justify-between mb-6">
           <div className="flex items-center">
             <FiFilter className="w-6 h-6 text-amber-600 mr-3" />
             <h2 className="text-xl font-bold text-gray-800">Filtros Avanzados</h2>
           </div>
           {(filtroArticulo || filtroBodega || filtroValorVariante) && (
             <button
               onClick={clearFilters}
               className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
             >
               Limpiar Filtros
             </button>
           )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Filtro Artículo */}
           <div>
             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
               <FiPackage className="w-4 h-4 mr-2 text-blue-600" />
               Artículo
             </label>
             <select
               value={filtroArticulo}
               onChange={(e) => setFiltroArticulo(e.target.value)}
               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
             >
               <option value="">Todos los artículos</option>
               {articulos.map((a) => {
                 const [id, nombre] = a.split('-')
                 return (
                   <option key={a} value={a}>
                     {nombre} (ID: {id})
                   </option>
                 )
               })}
             </select>
           </div>

           {/* Filtro Bodega */}
           <div>
             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
               <FiHome className="w-4 h-4 mr-2 text-green-600" />
               Bodega
             </label>
             <select
               value={filtroBodega}
               onChange={(e) => setFiltroBodega(e.target.value)}
               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
             >
               <option value="">Todas las bodegas</option>
               {bodegas.map((b) => {
                 const [id, nombre] = b.split('-')
                 return (
                   <option key={b} value={b}>
                     {nombre} (ID: {id})
                   </option>
                 )
               })}
             </select>
           </div>

           {/* Filtro Valor Variante */}
           <div>
             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
               <FiLayers className="w-4 h-4 mr-2 text-purple-600" />
               Valor de Variante
             </label>
             <select
               value={filtroValorVariante}
               onChange={(e) => setFiltroValorVariante(e.target.value)}
               className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
             >
               <option value="">Todos los valores</option>
               {valoresVariante.map((v) => (
                 <option key={v} value={v}>
                   {v}
                 </option>
               ))}
             </select>
           </div>
         </div>
       </div>

       {/* Tabla de inventario */}
       <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
         <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-gray-200">
           <h3 className="text-lg font-semibold text-gray-800 flex items-center">
             <FiArchive className="w-5 h-5 mr-2 text-amber-600" />
             Registros de Inventario ({filtrado.length})
           </h3>
         </div>

         <div className="overflow-x-auto">
           <table className="w-full">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   <div className="flex items-center">
                     <FiBox className="w-4 h-4 mr-2" />
                     Artículo
                   </div>
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   <div className="flex items-center">
                     <FiLayers className="w-4 h-4 mr-2" />
                     Variante
                   </div>
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   <div className="flex items-center">
                     <FiHome className="w-4 h-4 mr-2" />
                     Bodega
                   </div>
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   <div className="flex items-center">
                     <FiBarChart2 className="w-4 h-4 mr-2" />
                     Cantidad
                   </div>
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   <div className="flex items-center">
                     <FiTarget className="w-4 h-4 mr-2" />
                     Valores
                   </div>
                 </th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-200">
               {filtrado.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center">
                     <div className="flex flex-col items-center">
                       <FiArchive className="w-12 h-12 text-gray-400 mb-4" />
                       <p className="text-gray-500 text-lg">No se encontraron registros</p>
                       <p className="text-gray-400 text-sm mt-1">Ajusta los filtros para ver más resultados</p>
                     </div>
                   </td>
                 </tr>
               ) : (
                 filtrado.map((item, i) => (
                   <tr key={i} className="hover:bg-gray-50 transition-colors duration-200">
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-medium text-gray-900">{item.variante.articulo.nombre}</div>
                       <div className="text-sm text-gray-500">ID: {item.variante.articulo.id}</div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                         {item.variante.nombre}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                         {item.bodega.nombre}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                           item.cantidad > 10 
                             ? 'bg-green-100 text-green-800' 
                             : item.cantidad > 5 
                             ? 'bg-yellow-100 text-yellow-800' 
                             : 'bg-red-100 text-red-800'
                         }`}>
                           {item.cantidad}
                         </span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       {item.variante.valores && item.variante.valores.length > 0 ? (
                         <div className="flex flex-wrap gap-1">
                           {item.variante.valores.map((v, idx) => (
                             <span 
                               key={idx}
                               className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800"
                             >
                               {v.nombre}
                             </span>
                           ))}
                         </div>
                       ) : (
                         <span className="text-gray-400 text-sm">Sin valores</span>
                       )}
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
       </div>
     </div>
   </div>
 )
}