'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { FiBox, FiArchive, FiShoppingBag, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

ChartJS.register(ArcElement, Tooltip, Legend)

interface DashboardStats {
  totalArticulos: number
  totalBodegas: number
  totalInventario: number
  totalCompras: number
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
  comprasPorMes: Array<{
    mes: string
    total: number
  }>
  alertasInventario: Array<{
    articulo: string
    cantidad: number
    minimo: number
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
    <main className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 shadow-lg rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold">Bienvenido, {user?.nombre}</h1>
        <p className="mt-2 text-blue-100 dark:text-blue-200">Panel de control de su empresa</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded relative">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Artículos" 
              value={stats?.totalArticulos || 0} 
              icon={<FiBox />}
              color="blue"
              trend="+5%"
            />
            <StatCard 
              title="Total Bodegas" 
              value={stats?.totalBodegas || 0} 
              icon={<FiArchive />}
              color="green"
              trend="0%"
            />
            <StatCard 
              title="Total Inventario" 
              value={stats?.totalInventario || 0} 
              icon={<FiShoppingBag />}
              color="purple"
              trend="+12%"
            />
            <StatCard 
              title="Total Compras" 
              value={stats?.totalCompras || 0} 
              icon={<FiTrendingUp />}
              color="amber"
              trend="+8%"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <FiArchive className="mr-2" /> Distribución de Inventario
              </h2>
              <div className="aspect-square">
                <Doughnut
                  data={inventarioChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value.toLocaleString()} unidades`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTrendingUp className="mr-2" /> Compras Mensuales
              </h2>
              <div className="h-80">
                <Bar
                  data={{
                    labels: stats?.comprasPorMes?.map(item => item.mes) || [],
                    datasets: [
                      {
                        label: 'Total de Compras',
                        data: stats?.comprasPorMes?.map(item => item.total) || [],
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const value = context.raw || 0;
                            return `$ ${value.toLocaleString()}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return '$ ' + value.toLocaleString();
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiAlertCircle className="mr-2 text-amber-500" /> Alertas de Inventario
              </h2>
              <div className="space-y-4">
                {stats?.alertasInventario?.length ? (
                  stats.alertasInventario.map((alerta, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div>
                        <h3 className="font-medium text-amber-900">{alerta.articulo}</h3>
                        <p className="text-sm text-amber-600">Stock actual: {alerta.cantidad} | Mínimo: {alerta.minimo}</p>
                      </div>
                      <div className="text-amber-500">
                        <FiAlertCircle size={24} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No hay alertas de inventario</p>
                )}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiShoppingBag className="mr-2" /> Últimas Compras
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {stats?.ultimasCompras?.length ? (
                      stats.ultimasCompras.map((compra) => (
                        <tr key={compra.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {new Date(compra.fecha).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{compra.proveedor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${compra.total.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
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

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'amber'
  trend: string
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorMap = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    amber: 'bg-amber-500 text-white'
  }

  const trendColor = trend.startsWith('+') ? 'text-green-500' : trend === '0%' ? 'text-gray-500' : 'text-red-500'

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${colorMap[color]}`}>
            <div className="h-6 w-6">{icon}</div>
          </div>
          <div className="ml-4">
            <h2 className="text-gray-600 text-sm">{title}</h2>
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          </div>
        </div>
        <div className={`text-sm font-medium ${trendColor}`}>{trend}</div>
      </div>
    </div>
  )
}
