'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiInfo } from 'react-icons/fi'

interface TooltipProps {
 children: React.ReactNode
 content: string
 disabled?: boolean
 position?: 'top' | 'bottom' | 'left' | 'right'
 variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
}

export default function Tooltip({ 
 children, 
 content, 
 disabled = false,
 position = 'right',
 variant = 'default'
}: TooltipProps) {
 const [isVisible, setIsVisible] = useState(false)

 if (disabled) return <>{children}</>

 const getVariantStyles = () => {
   switch (variant) {
     case 'info':
       return 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white border-indigo-500'
     case 'success':
       return 'bg-gradient-to-r from-green-600 to-green-800 text-white border-green-500'
     case 'warning':
       return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-500'
     case 'error':
       return 'bg-gradient-to-r from-red-600 to-red-800 text-white border-red-500'
     default:
       return 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-700'
   }
 }

 const getPositionStyles = () => {
   switch (position) {
     case 'top':
       return {
         bottom: '100%',
         left: '50%',
         transform: 'translateX(-50%)',
         marginBottom: '0.5rem'
       }
     case 'bottom':
       return {
         top: '100%',
         left: '50%',
         transform: 'translateX(-50%)',
         marginTop: '0.5rem'
       }
     case 'left':
       return {
         right: '100%',
         top: '50%',
         transform: 'translateY(-50%)',
         marginRight: '0.5rem'
       }
     case 'right':
     default:
       return {
         left: '100%',
         top: '50%',
         transform: 'translateY(-50%)',
         marginLeft: '0.5rem'
       }
   }
 }

 const getAnimationDirection = () => {
   switch (position) {
     case 'top':
       return { y: 5 }
     case 'bottom':
       return { y: -5 }
     case 'left':
       return { x: -5 }
     case 'right':
     default:
       return { y: 5 }
   }
 }

 const getArrowStyles = () => {
   const baseArrow = 'absolute w-2 h-2 rotate-45'
   const variantBg = variant === 'info' ? 'bg-indigo-600' :
                    variant === 'success' ? 'bg-green-600' :
                    variant === 'warning' ? 'bg-amber-600' :
                    variant === 'error' ? 'bg-red-600' : 'bg-gray-800'

   switch (position) {
     case 'top':
       return `${baseArrow} ${variantBg} top-full left-1/2 -translate-x-1/2 -translate-y-1/2`
     case 'bottom':
       return `${baseArrow} ${variantBg} bottom-full left-1/2 -translate-x-1/2 translate-y-1/2`
     case 'left':
       return `${baseArrow} ${variantBg} left-full top-1/2 -translate-y-1/2 -translate-x-1/2`
     case 'right':
     default:
       return `${baseArrow} ${variantBg} right-full top-1/2 -translate-y-1/2 translate-x-1/2`
   }
 }

 return (
   <div
     className="relative inline-block"
     onMouseEnter={() => setIsVisible(true)}
     onMouseLeave={() => setIsVisible(false)}
   >
     {children}
     <AnimatePresence>
       {isVisible && (
         <motion.div
           initial={{ opacity: 0, scale: 0.95, ...getAnimationDirection() }}
           animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
           exit={{ opacity: 0, scale: 0.95, ...getAnimationDirection() }}
           transition={{ 
             duration: 0.2,
             ease: [0.4, 0, 0.2, 1]
           }}
           className={`absolute z-50 px-3 py-2 text-sm rounded-lg shadow-xl border whitespace-nowrap backdrop-blur-sm ${getVariantStyles()}`}
           style={getPositionStyles()}
         >
           {/* Flecha del tooltip */}
           <div className={getArrowStyles()}></div>
           
           {/* Contenido con icono opcional */}
           <div className="flex items-center gap-2">
             {variant === 'info' && <FiInfo className="w-4 h-4 flex-shrink-0" />}
             <span className="font-medium">{content}</span>
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   </div>
 )
}