'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Función para resolver el tema actual
  const resolveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return currentTheme
  }

  // Aplicar tema al DOM de forma segura
  const applyTheme = (newResolvedTheme: 'light' | 'dark') => {
    const root = document.documentElement
    
    // Remover clases existentes
    root.classList.remove('light', 'dark')
    
    // Agregar nueva clase
    root.classList.add(newResolvedTheme)
    
    // También manejar la clase 'dark' para compatibilidad con Tailwind
    if (newResolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    console.log(`🎨 Sistema SC - Tema aplicado: ${newResolvedTheme}`)
  }

  useEffect(() => {
    // Prevenir hidration mismatch usando requestAnimationFrame
    const initializeTheme = () => {
      try {
        // Verificar tema guardado
        const savedTheme = localStorage.getItem('sistema-sc-theme') as Theme
        const initialTheme = savedTheme || 'system'
        
        setThemeState(initialTheme)
        
        const resolved = resolveTheme(initialTheme)
        setResolvedTheme(resolved)
        applyTheme(resolved)
        
        console.log(`🚀 Sistema SC - Tema inicializado: ${initialTheme} (resuelto: ${resolved})`)
      } catch (error) {
        console.error('❌ Sistema SC - Error inicializando tema:', error)
        // Fallback seguro
        setThemeState('light')
        setResolvedTheme('light')
        applyTheme('light')
      }
    }

    // Usar requestAnimationFrame para evitar conflictos de renderizado
    requestAnimationFrame(initializeTheme)
  }, [])

  // Escuchar cambios en preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const resolved = resolveTheme('system')
        setResolvedTheme(resolved)
        applyTheme(resolved)
        console.log(`🔄 Sistema SC - Tema del sistema cambió a: ${resolved}`)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const newTheme = themes[(currentIndex + 1) % themes.length]
    
    setTheme(newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    try {
      setThemeState(newTheme)
      localStorage.setItem('sistema-sc-theme', newTheme)
      
      const resolved = resolveTheme(newTheme)
      setResolvedTheme(resolved)
      applyTheme(resolved)
      
      console.log(`⚙️ Sistema SC - Tema cambiado a: ${newTheme} (resuelto: ${resolved})`)
    } catch (error) {
      console.error('❌ Sistema SC - Error cambiando tema:', error)
    }
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        resolvedTheme, 
        toggleTheme, 
        setTheme 
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider en el Sistema SC')
  }
  return context
}

// Hook para componentes que necesitan el tema resuelto
export function useResolvedTheme() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme
}

// Hook para detectar si es tema oscuro
export function useIsDark() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark'
}

export default ThemeProvider