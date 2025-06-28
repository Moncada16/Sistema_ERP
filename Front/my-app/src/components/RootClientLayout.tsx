'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { SidebarProvider } from '@/context/SidebarContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { HydrationFix } from '@/components/HydrationFix'
import ThemeToggle from '@/components/ThemeToggle'

export default function RootClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HydrationFix />
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <div className="relative">
              <Navbar />
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>
              {children}
              <Footer />
            </div>
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}