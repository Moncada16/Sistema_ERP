'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'E', ingresos: 2500 },
  { name: 'M', ingresos: 3000 },
  { name: 'J', ingresos: 3200 },
  { name: 'S', ingresos: 3700 },
  { name: 'N', ingresos: 4800 },
]

export default function ChartSection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-80">
      <h3 className="text-lg font-semibold mb-4">Ingresos y Gastos</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
