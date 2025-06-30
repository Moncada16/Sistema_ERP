'use client'

import { Suspense } from 'react'
import { FiShoppingCart, FiLoader } from 'react-icons/fi'
import CrearCompraForm from '@/app/inicio/compras/CrearCompraForm'

export default function Page() {
 return (
   <div className="min-h-screen bg-gray-50">
     {/* Header de la página */}
     <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-xl shadow-xl p-8 text-white mb-8">
       <div className="flex items-center">
         <FiShoppingCart className="w-10 h-10 mr-4" />
         <div>
           <h1 className="text-3xl font-bold">Nueva Compra</h1>
           <p className="text-rose-100 mt-2">Registra una nueva compra en el Sistema SC</p>
         </div>
       </div>
     </div>

     {/* Contenido principal con Suspense */}
     <Suspense 
       fallback={
         <div className="flex justify-center items-center h-64">
           <div className="text-center">
             <FiLoader className="w-12 h-12 text-rose-600 animate-spin mx-auto mb-4" />
             <p className="text-gray-600 font-medium">Cargando formulario de compra...</p>
           </div>
         </div>
       }
     >
       <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
         <CrearCompraForm />
       </div>
     </Suspense>
   </div>
 )
}