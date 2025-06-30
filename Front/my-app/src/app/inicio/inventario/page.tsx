'use client'

import TodoInventarioFiltrado from '@/components/TodoInventarioFiltrado'
import { FiArchive, FiBarChart2, FiPackage, FiTrendingUp, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

export default function InventarioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Premium con Gradiente */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-6">
                <FiArchive className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Inventario General
                </h1>
                <p className="text-amber-100 text-lg">
                  Control completo de stock y movimientos de inventario
                </p>
              </div>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="hidden lg:flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-amber-200 text-sm">Artículos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">98.5%</div>
                <div className="text-amber-200 text-sm">Precisión</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">15</div>
                <div className="text-amber-200 text-sm">Alertas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total de Productos */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Productos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">1,247</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                  +12% este mes
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3">
                <FiPackage className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Valor Total */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Valor Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">$45.2M</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                  +8.5% este mes
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3">
                <FiBarChart2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Stock Bajo */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Stock Bajo</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">15</p>
                <p className="text-amber-600 text-sm mt-2 flex items-center">
                  <FiAlertTriangle className="w-4 h-4 mr-1" />
                  Requiere atención
                </p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-3">
                <FiAlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Productos Activos */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Productos Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">1,232</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <FiCheckCircle className="w-4 h-4 mr-1" />
                  98.8% del total
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3">
                <FiCheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Alertas importantes */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <FiAlertTriangle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Atención Requerida
              </h3>
              <p className="text-amber-700 mb-4">
                Hay 15 productos con stock bajo que requieren reposición inmediata.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  Zapato Deportivo - Stock: 2
                </span>
                <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  Bota Casual - Stock: 1
                </span>
                <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  +13 más
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Componente principal de inventario */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiArchive className="w-6 h-6 mr-3 text-amber-600" />
              Gestión de Inventario
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Filtros avanzados y control detallado de stock
            </p>
          </div>
          
          <div className="p-6">
            <TodoInventarioFiltrado />
          </div>
        </div>

        {/* Footer informativo */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-amber-600">Bendito Calzado</span> - 
            Sistema de inventario actualizado en tiempo real
          </p>
          <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Sistema en línea
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Sincronizado
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}