'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
}

export default function ModalInteractivo({ isOpen, title, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-lg mx-4 rounded-2xl border border-gray-300 p-6 shadow-xl relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            {title && <h2 className="text-xl font-bold text-black mb-4">{title}</h2>}

            <div className="text-black">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
