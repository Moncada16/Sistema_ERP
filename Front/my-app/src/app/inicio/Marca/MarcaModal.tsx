'use client'

import { useEffect, useState } from 'react'

interface Marca {
 id?: number
 nombre: string
 descripcion?: string
 logo?: string
}

type Props = {
 open: boolean
 modo: 'crear' | 'editar'
 initialData?: Marca
 onClose: () => void
 onSubmit: (data: Partial<Marca>, id?: number) => void
}

const defaultForm: Marca = {
 nombre: '',
 descripcion: '',
 logo: ''
}

export default function MarcaModal({ open, modo, initialData, onClose, onSubmit }: Props) {
 const [form, setForm] = useState<Marca>(defaultForm)
 const [errors, setErrors] = useState<Record<string, string>>({})
 const [isSubmitting, setIsSubmitting] = useState(false)

 useEffect(() => {
   if (initialData) {
     setForm({
       nombre: initialData.nombre || '',
       descripcion: initialData.descripcion || '',
       logo: initialData.logo || ''
     })
   } else {
     setForm(defaultForm)
   }
   setErrors({})
 }, [initialData, open])

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
   const { name, value } = e.target
   setForm(prev => ({ ...prev, [name]: value }))
   
   // Limpiar error del campo cuando el usuario empiece a escribir
   if (errors[name]) {
     setErrors(prev => ({ ...prev, [name]: '' }))
   }
 }

 const validateForm = (): boolean => {
   const newErrors: Record<string, string> = {}

   if (!form.nombre.trim()) {
     newErrors.nombre = 'El nombre es requerido'
   } else if (form.nombre.trim().length < 2) {
     newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
   }

   if (form.descripcion && form.descripcion.length > 200) {
     newErrors.descripcion = 'La descripción no puede exceder 200 caracteres'
   }

   if (form.logo && form.logo.trim() && !isValidUrl(form.logo.trim())) {
     newErrors.logo = 'Debe ser una URL válida'
   }

   setErrors(newErrors)
   return Object.keys(newErrors).length === 0
 }

 const isValidUrl = (string: string) => {
   try {
     new URL(string)
     return true
   } catch (_) {
     return false
   }
 }

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   
   if (!validateForm()) return

   setIsSubmitting(true)
   
   try {
     const dataToSubmit = {
       nombre: form.nombre.trim(),
       descripcion: form.descripcion?.trim() || undefined,
       logo: form.logo?.trim() || undefined
     }

     await onSubmit(dataToSubmit, initialData?.id)
     onClose()
   } catch (error) {
     console.error('Error en modal:', error)
   } finally {
     setIsSubmitting(false)
   }
 }

 const handleBackdropClick = (e: React.MouseEvent) => {
   if (e.target === e.currentTarget) {
     onClose()
   }
 }

 if (!open) return null

 return (
   <div 
     className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
     onClick={handleBackdropClick}
   >
     <div 
       className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
       onClick={(e) => e.stopPropagation()}
     >
       <div className="p-6 space-y-4">
         {/* Header */}
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-semibold text-gray-800">
             {modo === 'crear' ? '➕ Nueva Marca' : '✏️ Editar Marca'}
           </h2>
           <button
             onClick={onClose}
             className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
           >
             ×
           </button>
         </div>

         {/* Form */}
         <form onSubmit={handleSubmit} className="space-y-4">
           {/* Nombre */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Nombre de la marca *
             </label>
             <input
               type="text"
               name="nombre"
               value={form.nombre}
               onChange={handleChange}
               placeholder="Ej: Nike, Adidas, Zara..."
               className={`w-full px-3 py-2 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${
                 errors.nombre ? 'border-red-300' : 'border-gray-300'
               }`}
               disabled={isSubmitting}
             />
             {errors.nombre && (
               <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
             )}
           </div>

           {/* Descripción */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Descripción (opcional)
             </label>
             <textarea
               name="descripcion"
               value={form.descripcion}
               onChange={handleChange}
               placeholder="Describe la marca y qué tipo de productos ofrece..."
               rows={3}
               className={`w-full px-3 py-2 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black resize-none ${
                 errors.descripcion ? 'border-red-300' : 'border-gray-300'
               }`}
               disabled={isSubmitting}
             />
             {errors.descripcion && (
               <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
             )}
             <p className="text-xs text-gray-500 mt-1">
               {form.descripcion?.length || 0}/200 caracteres
             </p>
           </div>

           {/* Logo URL */}
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               URL del logo (opcional)
             </label>
             <input
               type="url"
               name="logo"
               value={form.logo}
               onChange={handleChange}
               placeholder="https://ejemplo.com/logo.png"
               className={`w-full px-3 py-2 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${
                 errors.logo ? 'border-red-300' : 'border-gray-300'
               }`}
               disabled={isSubmitting}
             />
             {errors.logo && (
               <p className="text-red-500 text-xs mt-1">{errors.logo}</p>
             )}
             <p className="text-xs text-gray-500 mt-1">
               URL de la imagen del logo de la marca
             </p>
           </div>

           {/* Vista previa del logo */}
           {form.logo && form.logo.trim() && isValidUrl(form.logo.trim()) && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Vista previa del logo
               </label>
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                 <img 
                   src={form.logo.trim()} 
                   alt="Vista previa" 
                   className="w-12 h-12 object-contain rounded"
                   onError={(e) => {
                     e.currentTarget.style.display = 'none'
                   }}
                 />
                 <div>
                   <p className="font-medium text-gray-900">{form.nombre || 'Nombre de la marca'}</p>
                   <p className="text-sm text-gray-600">Logo cargado correctamente</p>
                 </div>
               </div>
             </div>
           )}

           {/* Botones */}
           <div className="flex justify-end gap-3 pt-4">
             <button
               type="button"
               onClick={onClose}
               disabled={isSubmitting}
               className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
             >
               Cancelar
             </button>
             <button
               type="submit"
               disabled={isSubmitting || !form.nombre.trim()}
               className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSubmitting ? '⏳ Guardando...' : modo === 'crear' ? '💾 Crear' : '💾 Actualizar'}
             </button>
           </div>
         </form>
       </div>
     </div>
   </div>
 )
}