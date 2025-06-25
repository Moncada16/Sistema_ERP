const notifications = [
  { title: 'Effichat', message: 'Nuevo mensaje de cliente' },
  { title: 'Ventas', message: 'Pedido +284 completado' },
  { title: 'Effichat', message: 'Nuevo mensaje de cliente' },
]

export default function Notifications() {
  return (
    <ul className="space-y-4">
      {notifications.map((item, i) => (
        <li key={i} className="border-b pb-2">
          <p className="text-sm font-bold">{item.title}</p>
          <p className="text-sm text-gray-600">{item.message}</p>
        </li>
      ))}
    </ul>
  )
}
