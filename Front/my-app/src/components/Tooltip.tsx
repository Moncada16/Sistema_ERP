'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  children: React.ReactNode
  content: string
  disabled?: boolean
}

export default function Tooltip({ children, content, disabled = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  if (disabled) return <>{children}</>

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
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg whitespace-nowrap"
            style={{
              left: '100%',
              marginLeft: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}