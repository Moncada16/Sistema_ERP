'use client'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@/app/context/ThemeContext'

export default function ThemeToggle() {
 const { theme, toggleTheme } = useTheme()

 return (
   <button
     onClick={toggleTheme}
     className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 
               text-white hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 
               shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none 
               focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
               dark:from-amber-600 dark:to-amber-800 dark:hover:from-amber-700 dark:hover:to-amber-900"
     aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
   >
     {theme === 'light' ? (
       <FiMoon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
     ) : (
       <FiSun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
     )}
   </button>
 )
}