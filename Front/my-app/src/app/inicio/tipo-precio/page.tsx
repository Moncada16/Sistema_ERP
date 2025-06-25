'use client';

import { useEffect, useState } from 'react';

interface TipoPrecio {
  id: string | null;
  _id: string;
  nombre: string;
}

export default function TipoPrecioPage() {
  const [nombre, setNombre] = useState('');
  const [tiposPrecio, setTiposPrecio] = useState<TipoPrecio[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');

  const API_URL = 'http://localhost:3001/api/tipoPrecio';

  const obtenerTipos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al cargar los tipos de precio');
      const data = await res.json();
      setTiposPrecio(data);
    } catch (err) {
      console.error('Error al cargar los tipos de precio:', err);
      alert('Error al cargar los tipos de precio');
    }
  };

  const crearTipo = async () => {
    if (!nombre.trim()) return alert('Nombre requerido');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      });
      if (!res.ok) throw new Error('Error al crear tipo de precio');
      alert('Tipo de precio creado');
      setNombre('');
      obtenerTipos();
    } catch (err) {
      console.error('Error al crear tipo de precio:', err);
      alert('Error al crear tipo de precio');
    }
  };

  const eliminarTipo = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      alert('Eliminado');
      obtenerTipos();
    } catch (err) {
      console.error('Error al eliminar tipo de precio:', err);
      alert('Error al eliminar');
    }
  };

  const guardarEdicion = async () => {
    if (!editNombre.trim() || !editandoId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${editandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: editNombre }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      alert('Actualizado');
      setEditandoId(null);
      setEditNombre('');
      obtenerTipos();
    } catch (err) {
      console.error('Error al actualizar tipo de precio:', err);
      alert('Error al actualizar');
    }
  };

  useEffect(() => {
    obtenerTipos();
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Tipos de Precio</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Nombre del tipo de precio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={crearTipo} style={{ padding: '0.5rem 1rem' }}>
          Crear
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Nombre</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tiposPrecio.map((tipo) => (
            <tr key={tipo._id}>
              <td style={{ padding: '0.5rem' }}>
                {editandoId === tipo.id ? (
                  <input
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    style={{ width: '100%', padding: '0.25rem' }}
                  />
                ) : (
                  tipo.nombre
                )}
              </td>
              <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                {editandoId === tipo._id ? (
                  <button onClick={guardarEdicion} style={{ marginRight: '0.5rem' }}>
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditandoId(tipo._id);
                      setEditNombre(tipo.nombre);
                    }}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Editar
                  </button>
                )}
                <button onClick={() => eliminarTipo(tipo._id)} style={{ color: 'red' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
