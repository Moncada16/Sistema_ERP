'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Articulo = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  codigo: string;
};

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/articulos`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) throw new Error('Error al obtener los artículos');
        const data = await res.json();
        setArticulos(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticulos();
  }, [API_BASE_URL, token]);

  const eliminarArticulo = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/articulos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) throw new Error('Error al eliminar el artículo');
      setArticulos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (loading) return <p className="p-4">Cargando artículos...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lista de Artículos</h1>
        <Link href="/articulos/nuevo">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Crear Artículo
          </button>
        </Link>
      </div>

      {articulos.length === 0 ? (
        <p>No hay artículos disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {articulos.map((articulo) => (
            <li key={articulo.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{articulo.nombre}</h2>
              <p>{articulo.descripcion}</p>
              <p className="text-gray-600">Precio: ${articulo.precio}</p>
              <p className="text-sm text-gray-500">Código: {articulo.codigo}</p>
              <div className="mt-2 space-x-4">
                <Link href={`/articulos/${articulo.id}`} className="text-blue-500 underline">Ver</Link>
                <Link href={`/articulos/${articulo.id}/editar`} className="text-green-500 underline">Editar</Link>
                <button
                  onClick={() => eliminarArticulo(articulo.id)}
                  className="text-red-500 underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
