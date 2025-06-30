'use client'

import { useState, useEffect } from 'react'
import { FiMessageCircle, FiShoppingCart, FiTrendingUp, FiBell, FiX, FiEye, FiClock, FiCheck } from 'react-icons/fi'

interface Notification {
  id: number
  title: string
  message: string
  type: 'chat' | 'ventas' | 'sistema' | 'inventario'
  time: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

const notifications: Notification[] = [
  { 
    id: 1,
    title: 'Effichat', 
    message: 'Nuevo mensaje de cliente - María González pregunta sobre disponibilidad',
    type: 'chat',
    time: '2 min',
    read: false,
    priority: 'high'
  },
  { 
    id: 2,
    title: 'Ventas', 
    message: 'Pedido #284 completado exitosamente - $156.000 COP',
    type: 'ventas',
    time: '5 min',
    read: false,
    priority: 'medium'
  },
  { 
    id: 3,
    title: 'Inventario', 
    message: 'Stock bajo: Zapatillas Nike Air Force quedan solo 3 unidades',
    type: 'inventario',
    time: '15 min',
    read: true,
    priority: 'high'
  },
  { 
    id: 4,
    title: 'Effichat', 
    message: 'Carlos Pérez ha calificado su compra con 5 estrellas',
    type: 'chat',
    time: '1 hora',
    read: true,
    priority: 'low'
  },
  { 
    id: 5,
    title: 'Sistema', 
    message: 'Actualización completada - Nuevas funciones disponibles',
    type: 'sistema',
    time: '2 horas',
    read: false,
    priority: 'medium'
  }
]

export default function Notifications() {
  const [notificationList, setNotificationList] = useState<Notification[]>(notifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const getIcon = (type: string) => {
    switch (type) {
      case 'chat': return FiMessageCircle
      case 'ventas': return FiShoppingCart
      case 'inventario': return FiTrendingUp
      default: return FiBell
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chat': return 'blue'
      case 'ventas': return 'green'
      case 'inventario': return 'amber'
      case 'sistema': return 'purple'
      default: return 'gray'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'gray'
    }
  }

  const markAsRead = (id: number) => {
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const removeNotification = (id: number) => {
    setNotificationList(prev => prev.filter(notif => notif.id !== id))
  }

  const filteredNotifications = filter === 'unread' 
    ? notificationList.filter(notif => !notif.read)
    : notificationList

  const unreadCount = notificationList.filter(notif => !notif.read).length

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiBell className="w-6 h-6 text-white mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
              <p className="text-blue-100 text-sm">
                {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <div className="relative">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
                {unreadCount}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Todas ({notificationList.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Sin leer ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <FiCheck className="w-4 h-4 mr-1" />
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
            </h4>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? '¡Excelente! Estás al día con todas tus notificaciones.' 
                : 'Las notificaciones aparecerán aquí cuando lleguen.'
              }
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type)
              const typeColor = getTypeColor(notification.type)
              const priorityColor = getPriorityColor(notification.priority)

              return (
                <li 
                  key={notification.id} 
                  className={`group relative px-6 py-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icono */}
                    <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br from-${typeColor}-500 to-${typeColor}-600 rounded-lg flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h4>
                          
                          {/* Badge de prioridad */}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-800`}>
                            {notification.priority === 'high' && '🔥'}
                            {notification.priority === 'medium' && '⚡'}
                            {notification.priority === 'low' && '💡'}
                            {notification.priority}
                          </span>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-gray-500 text-xs">
                            <FiClock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </div>
                          
                          {/* Botones de acción */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                                title="Marcar como leída"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                              title="Eliminar notificación"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Footer con estadísticas */}
      {notificationList.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Total: {notificationList.length} notificaciones</span>
            <span>Sin leer: {unreadCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}