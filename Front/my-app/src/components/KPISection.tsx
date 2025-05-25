type KPIProps = {
  title: string
  value: string
}

export default function KPISection({ title, value }: KPIProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center">
      <span className="text-sm text-gray-500">{title}</span>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  )
}
