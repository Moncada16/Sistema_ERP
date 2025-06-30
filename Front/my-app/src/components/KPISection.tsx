'use client'

import { FiTrendingUp, FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi'

type KPIProps = {
 title: string
 value: string
 icon?: React.ReactNode
 trend?: 'up' | 'down' | 'neutral'
 trendValue?: string
 color?: 'blue' | 'green' | 'purple' | 'amber' | 'indigo' | 'rose' | 'red'
 subtitle?: string
}

export default function KPISection({ 
 title, 
 value, 
 icon,
 trend,
 trendValue,
 color = 'blue',
 subtitle
}: KPIProps) {
 const colorMap = {
   blue: {
     bg: 'bg-blue-500',
     text: 'text-blue-600',
     bgLight: 'bg-blue-50',
     border: 'border-blue-200',
     gradient: 'from-blue-500 to-blue-600'
   },
   green: {
     bg: 'bg-green-500',
     text: 'text-green-600',
     bgLight: 'bg-green-50',
     border: 'border-green-200',
     gradient: 'from-green-500 to-green-600'
   },
   purple: {
     bg: 'bg-purple-500',
     text: 'text-purple-600',
     bgLight: 'bg-purple-50',
     border: 'border-purple-200',
     gradient: 'from-purple-500 to-purple-600'
   },
   amber: {
     bg: 'bg-amber-500',
     text: 'text-amber-600',
     bgLight: 'bg-amber-50',
     border: 'border-amber-200',
     gradient: 'from-amber-500 to-amber-600'
   },
   indigo: {
     bg: 'bg-indigo-500',
     text: 'text-indigo-600',
     bgLight: 'bg-indigo-50',
     border: 'border-indigo-200',
     gradient: 'from-indigo-500 to-indigo-600'
   },
   rose: {
     bg: 'bg-rose-500',
     text: 'text-rose-600',
     bgLight: 'bg-rose-50',
     border: 'border-rose-200',
     gradient: 'from-rose-500 to-rose-600'
   },
   red: {
     bg: 'bg-red-500',
     text: 'text-red-600',
     bgLight: 'bg-red-50',
     border: 'border-red-200',
     gradient: 'from-red-500 to-red-600'
   }
 }

 const colors = colorMap[color]

 const getTrendIcon = () => {
   switch (trend) {
     case 'up':
       return <FiArrowUp className="w-4 h-4 text-green-500" />
     case 'down':
       return <FiArrowDown className="w-4 h-4 text-red-500" />
     case 'neutral':
       return <FiMinus className="w-4 h-4 text-gray-500" />
     default:
       return null
   }
 }

 const getTrendColor = () => {
   switch (trend) {
     case 'up':
       return 'text-green-600 bg-green-50'
     case 'down':
       return 'text-red-600 bg-red-50'
     case 'neutral':
       return 'text-gray-600 bg-gray-50'
     default:
       return ''
   }
 }

 return (
   <div className={`bg-white rounded-xl shadow-xl border ${colors.border} p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
     {/* Header con icono */}
     <div className="flex items-center justify-between mb-4">
       <div className="flex items-center">
         {icon ? (
           <div className={`p-3 rounded-xl ${colors.bgLight} mr-3`}>
             <div className={`w-6 h-6 ${colors.text}`}>
               {icon}
             </div>
           </div>
         ) : (
           <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} mr-3`}>
             <FiTrendingUp className="w-6 h-6 text-white" />
           </div>
         )}
       </div>
       
       {/* Indicador de tendencia */}
       {trend && trendValue && (
         <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
           {getTrendIcon()}
           <span className="ml-1">{trendValue}</span>
         </div>
       )}
     </div>

     {/* Contenido principal */}
     <div className="space-y-2">
       <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
         {title}
       </h3>
       
       <div className="flex items-baseline">
         <h2 className={`text-3xl font-bold ${colors.text}`}>
           {value}
         </h2>
       </div>
       
       {subtitle && (
         <p className="text-sm text-gray-500 mt-1">
           {subtitle}
         </p>
       )}
     </div>

     {/* Barra decorativa inferior */}
     <div className={`mt-4 h-1 bg-gradient-to-r ${colors.gradient} rounded-full`}></div>
   </div>
 )
}