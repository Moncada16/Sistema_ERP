'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@/app/context/ThemeContext'

import { SidebarProvider } from '@/app/context/SidebarContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { HydrationFix } from '@/components/HydrationFix'
import ThemeToggle from '@/components/ThemeToggle'
import { AuthProvider } from '@/app/context/AuthContext'

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