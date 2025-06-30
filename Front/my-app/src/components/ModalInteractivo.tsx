'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiAlertCircle } from 'react-icons/fi'

interface ModalProps {
 isOpen: boolean
 title?: string
 onClose: () => void
 children: React.ReactNode
 size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
 showCloseButton?: boolean
 closeOnBackdrop?: boolean
}

export default function ModalInteractivo({ 
 isOpen, 
 title, 
 onClose, 
 children,
 size = 'md',
 variant = 'default',
 showCloseButton = true,
 closeOnBackdrop = true
}: ModalProps) {

 const getSizeClasses = () => {
   switch (size) {
     case 'sm':
       return 'max-w-md'
     case 'md':
       return 'max-w-lg'
     case 'lg':
       return 'max-w-2xl'
     case 'xl':
       return 'max-w-4xl'
     case 'full':
       return 'max-w-7xl mx-8'
     default:
       return 'max-w-lg'
   }
 }

 const getVariantStyles = () => {
   switch (variant) {
     case 'primary':
       return {
         header: 'bg-gradient-to-r from-blue-600 to-blue-800',
         text: 'text-white'
       }
     case 'success':
       return {
         header: 'bg-gradient-to-r from-green-600 to-green-800',
         text: 'text-white'
       }
     case 'warning':
       return {
         header: 'bg-gradient-to-r from-amber-600 to-amber-800',
         text: 'text-white'
       }
     case 'error':
       return {
         header: 'bg-gradient-to-r from-red-600 to-red-800',
         text: 'text-white'
       }
     default:
       return {
         header: 'bg-gradient-to-r from-indigo-600 to-indigo-800',
         text: 'text-white'
       }
   }
 }

 const handleBackdropClick = (e: React.MouseEvent) => {
   if (closeOnBackdrop && e.target === e.currentTarget) {
     onClose()
   }
 }

 const variantStyles = getVariantStyles()

 return (
   <AnimatePresence>
     {isOpen && (
       <motion.div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         onClick={handleBackdropClick}
       >
         <motion.div
           className={`bg-white w-full ${getSizeClasses()} rounded-xl shadow-2xl relative overflow-hidden border border-gray-200`}
           initial={{ scale: 0.9, opacity: 0, y: 20 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.9, opacity: 0, y: 20 }}
           transition={{ 
             duration: 0.3,
             ease: [0.4, 0, 0.2, 1]
           }}
           onClick={(e) => e.stopPropagation()}
         >
           {/* Header del modal */}
           {title && (
             <div className={`${variantStyles.header} px-6 py-4 relative`}>
               <div className="flex items-center justify-between">
                 <div className="flex items-center">
                   {variant === 'error' && <FiAlertCircle className="w-6 h-6 mr-3" />}
                   <h2 className={`text-xl font-bold ${variantStyles.text}`}>
                     {title}
                   </h2>
                 </div>
                 {showCloseButton && (
                   <button
                     onClick={onClose}
                     className={`${variantStyles.text} hover:bg-white/20 rounded-lg p-2 transition-all duration-200 transform hover:scale-105`}
                     aria-label="Cerrar modal"
                   >
                     <FiX className="w-5 h-5" />
                   </button>
                 )}
               </div>
             </div>
           )}

           {/* Botón de cierre cuando no hay título */}
           {!title && showCloseButton && (
             <button
               onClick={onClose}
               className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200 transform hover:scale-105"
               aria-label="Cerrar modal"
             >
               <FiX className="w-5 h-5" />
             </button>
           )}

           {/* Contenido del modal */}
           <div className="p-6">
             <div className="text-gray-800">
               {children}
             </div>
           </div>
         </motion.div>
       </motion.div>
     )}
   </AnimatePresence>
 )
}