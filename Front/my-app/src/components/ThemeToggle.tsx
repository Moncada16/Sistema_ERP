'use client'

import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <FiMoon className="w-5 h-5" />
      ) : (
        <FiSun className="w-5 h-5" />
      )}
    </button>
  )
}