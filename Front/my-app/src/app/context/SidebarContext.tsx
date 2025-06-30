'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
 isOpen: boolean
 toggleSidebar: () => void
 closeSidebar: () => void
 openSidebar: () => void
 isMobile: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
 const [isOpen, setIsOpen] = useState(true)
 const [isMobile, setIsMobile] = useState(false)

 // Detectar si es dispositivo móvil
 useEffect(() => {
   const checkMobile = () => {
     const mobile = window.innerWidth < 1024 // lg breakpoint
     setIsMobile(mobile)
     
     // En móvil, cerrar sidebar por defecto
     if (mobile) {
       setIsOpen(false)
     } else {
       // En desktop, abrir por defecto
       setIsOpen(true)
     }
   }

   // Verificar inicialmente
   checkMobile()

   // Escuchar cambios de tamaño
   window.addEventListener('resize', checkMobile)
   
   // Limpiar listener
   return () => window.removeEventListener('resize', checkMobile)
 }, [])

 // Persistir estado del sidebar en localStorage (solo desktop)
 useEffect(() => {
   if (!isMobile) {
     const savedState = localStorage.getItem('sistema-sc-sidebar-open')
     if (savedState !== null) {
       setIsOpen(JSON.parse(savedState))
     }
   }
 }, [isMobile])

 useEffect(() => {
   if (!isMobile) {
     localStorage.setItem('sistema-sc-sidebar-open', JSON.stringify(isOpen))
   }
 }, [isOpen, isMobile])

 const toggleSidebar = () => {
   console.log('🔄 Sistema SC - Toggle sidebar:', !isOpen)
   setIsOpen(prev => !prev)
 }

 const closeSidebar = () => {
   console.log('📱 Sistema SC - Cerrando sidebar')
   setIsOpen(false)
 }

 const openSidebar = () => {
   console.log('📱 Sistema SC - Abriendo sidebar')
   setIsOpen(true)
 }

 // Cerrar sidebar automáticamente en móvil cuando se hace clic fuera
 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     if (!isMobile || !isOpen) return

     const sidebar = document.getElementById('sistema-sc-sidebar')
     const toggleButton = document.getElementById('sidebar-toggle-button')
     
     if (
       sidebar && 
       toggleButton &&
       !sidebar.contains(event.target as Node) &&
       !toggleButton.contains(event.target as Node)
     ) {
       closeSidebar()
     }
   }

   if (isMobile && isOpen) {
     document.addEventListener('mousedown', handleClickOutside)
     return () => document.removeEventListener('mousedown', handleClickOutside)
   }
 }, [isMobile, isOpen])

 // Bloquear scroll del body cuando sidebar está abierto en móvil
 useEffect(() => {
   if (isMobile) {
     if (isOpen) {
       document.body.style.overflow = 'hidden'
     } else {
       document.body.style.overflow = ''
     }
   } else {
     document.body.style.overflow = ''
   }

   // Limpiar al desmontar
   return () => {
     document.body.style.overflow = ''
   }
 }, [isMobile, isOpen])

 return (
   <SidebarContext.Provider 
     value={{ 
       isOpen, 
       toggleSidebar, 
       closeSidebar, 
       openSidebar, 
       isMobile 
     }}
   >
     {children}
   </SidebarContext.Provider>
 )
}

export const useSidebar = () => {
 const context = useContext(SidebarContext)
 if (!context) {
   throw new Error('useSidebar debe usarse dentro de un SidebarProvider en el Sistema SC')
 }
 return context
}

// Hook personalizado para auto-cerrar en móvil
export const useAutoCloseSidebar = () => {
 const { isMobile, closeSidebar } = useSidebar()
 
 const handleNavigation = () => {
   if (isMobile) {
     closeSidebar()
   }
 }

 return { handleNavigation }
}

export default SidebarProvider