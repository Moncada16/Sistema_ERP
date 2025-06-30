'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { FiTrendingUp, FiDollarSign, FiBarChart2, FiActivity } from 'react-icons/fi'

const data = [
  { name: 'Enero', ingresos: 2500, gastos: 1800, utilidad: 700 },
  { name: 'Febrero', ingresos: 3000, gastos: 2100, utilidad: 900 },
  { name: 'Marzo', ingresos: 3200, gastos: 2000, utilidad: 1200 },
  { name: 'Abril', ingresos: 3700, gastos: 2300, utilidad: 1400 },
  { name: 'Mayo', ingresos: 4800, gastos: 2800, utilidad: 2000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200 backdrop-blur-sm">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span>{' '}
            <span className="font-bold">${entry.value.toLocaleString('es-CO')}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ChartSection() {
  const totalIngresos = data.reduce((sum, item) => sum + item.ingresos, 0)
  const totalGastos = data.reduce((sum, item) => sum + item.gastos, 0)
  const totalUtilidad = totalIngresos - totalGastos
  const crecimiento = ((data[data.length - 1].ingresos - data[0].ingresos) / data[0].ingresos * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold">${totalIngresos.toLocaleString('es-CO')}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FiDollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            <span className="text-green-100 text-sm">+{crecimiento}% este período</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Gastos Totales</p>
              <p className="text-2xl font-bold">${totalGastos.toLocaleString('es-CO')}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FiBarChart2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-100 text-sm">Control de gastos operativos</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Utilidad Neta</p>
              <p className="text-2xl font-bold">${totalUtilidad.toLocaleString('es-CO')}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-blue-100 text-sm">
              {((totalUtilidad / totalIngresos) * 100).toFixed(1)}% margen
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Rentabilidad</p>
              <p className="text-2xl font-bold">{((totalUtilidad / totalIngresos) * 100).toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FiActivity className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-purple-100 text-sm">Excelente rendimiento</span>
          </div>
        </div>
      </div>

      {/* Gráfico Principal */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <FiTrendingUp className="w-7 h-7 mr-3 text-blue-600" />
              Análisis Financiero
            </h3>
            <p className="text-gray-600 mt-1">Evolución de ingresos, gastos y utilidad por mes</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Ingresos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Gastos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Utilidad</span>
            </div>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorIngresos)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              />
              
              <Area
                type="monotone"
                dataKey="gastos"
                stroke="#ef4444"
                strokeWidth={3}
                fill="url(#colorGastos)"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
              />
              
              <Area
                type="monotone"
                dataKey="utilidad"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#colorUtilidad)"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 font-medium text-sm">Mejor Mes</p>
                <p className="text-blue-900 font-bold">Mayo</p>
              </div>
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-medium text-sm">Crecimiento</p>
                <p className="text-green-900 font-bold">+{crecimiento}%</p>
              </div>
              <FiActivity className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-medium text-sm">Promedio Mensual</p>
                <p className="text-purple-900 font-bold">${(totalIngresos / data.length).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</p>
              </div>
              <FiBarChart2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}