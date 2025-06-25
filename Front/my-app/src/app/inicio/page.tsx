'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DashboardStats {
  totalArticulos: number
  totalBodegas: number
  totalInventario: number
  ultimasCompras: Array<{
    id: number
    fecha: string
    total: number
    proveedor: string
  }>
  inventarioPorBodega: Array<{
    bodega: string
    cantidad: number
  }>
}

export default function DashboardPage() {
  const { user } = useAuth()
  // const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('http://localhost:3001/dashboard/stats')
        setStats(response.data)
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err)
        setError('Error al cargar los datos del dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const inventarioChartData = {
    labels: stats?.inventarioPorBodega?.map(item => item.bodega) || [],
    datasets: [
      {
        data: stats?.inventarioPorBodega?.map(item => item.cantidad) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <main className="p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.nombre}</h1>
        <p className="mt-1 text-gray-600">Panel de control de su empresa</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Artículos" value={stats?.totalArticulos || 0} color="indigo" />
            <StatCard title="Total Bodegas" value={stats?.totalBodegas || 0} color="green" />
            <StatCard title="Total Inventario" value={stats?.totalInventario || 0} color="yellow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Inventario</h2>
              <div className="aspect-square">
                <Doughnut
                  data={inventarioChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimas Compras</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats?.ultimasCompras?.length ? (
                      stats.ultimasCompras.map((compra) => (
                        <tr key={compra.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(compra.fecha).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{compra.proveedor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${compra.total.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                          No hay compras recientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

function StatCard({ title, value }: { title: string; value: number; color: string }) {
  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorMap} `}>
          <div className="h-8 w-8">{/* Ícono personalizado si lo necesitas */}</div>
        </div>
        <div className="ml-4">
          <h2 className="text-gray-600">{title}</h2>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
