'use client';

import { useEffect, useState } from 'react';
import { getFields } from '@/services/cancha.service';
import { Field } from '@/types';
import { useAuth } from '@/context/AuthContext';
import AvailabilityModal from '@/components/AvailabilityModal';

const ITEMS_PER_PAGE = 6;

export default function CanchasPage() {
  const { token } = useAuth();

  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadFields() {
      try {
        const data = await getFields(token || undefined);
        setFields(data);
      } catch {
        setError('No se pudieron cargar las canchas');
      } finally {
        setLoading(false);
      }
    }

    loadFields();
  }, [token]);

  const totalPages = Math.ceil(fields.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const visibleFields = fields.slice(start, start + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Cargando canchas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-950 px-6 pt-24 pb-12">
        {/* FONDO GRADIENTE */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-900/90 to-sky-900/90" />

        <div className="mx-auto max-w-7xl">
          {/* TITLE */}
          <h1 className="mb-10 text-3xl font-extrabold tracking-tight text-white">
            Canchas disponibles
          </h1>

          {/* GRID */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFields.map((field) => (
              <div
                key={field.id}
                className="group rounded-2xl bg-white/10 p-5 text-white shadow-xl backdrop-blur-lg transition hover:-translate-y-1 hover:bg-white/15"
              >
                <h2 className="text-lg font-semibold">
                  {field.name}
                </h2>

                <p className="mt-1 text-sm text-white/70">
                  📍 {field.location}
                </p>

                <div className="mt-4 space-y-1 text-sm text-white/80">
                  <p>👥 Capacidad: {field.capacity}</p>
                  <p>
                    ⏰ {field.opening_time} – {field.closing_time}
                  </p>
                </div>

                <p className="mt-4 text-xl font-bold text-emerald-300">
                  ${field.price_per_hour} / hora
                </p>

                <button
                  onClick={() => setSelectedField(field)}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-sky-700 py-2.5 font-semibold text-white transition hover:from-emerald-500 hover:to-sky-600"
                >
                  Ver disponibilidad
                </button>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4 text-white">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg bg-white/20 px-4 py-2 text-sm disabled:opacity-40"
              >
                Anterior
              </button>

              <span className="text-sm opacity-80">
                Página {page} de {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg bg-white/20 px-4 py-2 text-sm disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {selectedField && token && (
        <AvailabilityModal
          field={selectedField}
          token={token}
          onClose={() => setSelectedField(null)}
        />
      )}
    </>
  );
}
