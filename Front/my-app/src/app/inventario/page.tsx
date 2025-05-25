'use client'

import TodoInventarioFiltrado from '@/components/TodoInventarioFiltrado'

export default function InventarioPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-6">📦 Inventario General</h1>
      <TodoInventarioFiltrado />
    </div>
  )
}
