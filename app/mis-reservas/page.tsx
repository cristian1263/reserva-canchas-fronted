'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyReservations } from '@/services/reserva.service';

type Reservation = {
    id: number;
    field_id: number;
    field_name: string;
    field_location: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    total_price: number;
    status: string;

};

export default function MisReservasPage() {
    const { token } = useAuth();

    const [reservas, setReservas] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadReservas() {
            try {
                if (!token) return;

                const response = await getMyReservations(token);

                // 🔥 NORMALIZAMOS RESPUESTA
                if (Array.isArray(response)) {
                    setReservas(response);
                } else if (Array.isArray(response.data)) {
                    setReservas(response.data);
                } else if (Array.isArray(response.reservations)) {
                    setReservas(response.reservations);
                } else {
                    setReservas([]);
                }

            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar tus reservas');
            } finally {
                setLoading(false);
            }
        }

        loadReservas();
    }, [token]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                Cargando reservas…
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
        <main className="min-h-screen bg-slate-950 pt-24 px-4">
            {/* HEADER */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-white">
                    Mis reservas
                </h1>
                <p className="mt-2 text-white/60">
                    Consulta y gestiona tus canchas reservadas
                </p>
            </div>

            {/* CONTENT */}
            {reservas.length === 0 ? (
                <div className="mx-auto max-w-xl rounded-2xl bg-white/5 p-8 text-center text-white/70 backdrop-blur">
                    No tienes reservas activas ⚽
                </div>
            ) : (
                <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {reservas.map((r) => (
                        <div
                            key={r.id}
                            className="relative overflow-hidden rounded-2xl bg-white/10 p-5 text-white shadow-lg backdrop-blur transition hover:scale-[1.02]"
                        >
                            {/* GRADIENT DECOR */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-900/40 to-sky-900/40" />

                            <h2 className="text-lg font-bold">{r.field_name}</h2>
                            <p className="text-sm text-white/70">
                                📍 {r.field_location}
                            </p>

                            <div className="mt-4 space-y-1 text-sm">
                                <p>📅 {r.start_time.split('T')[0]}</p>
                                <p>
                                    ⏰ {r.start_time.split('T')[1].slice(0, 5)} –{' '}
                                    {r.end_time.split('T')[1].slice(0, 5)}
                                </p>
                                <p>⏳ {r.duration_hours} hora{r.duration_hours > 1 ? 's' : ''}</p>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-lg font-bold text-emerald-300">
                                    ${r.total_price}
                                </span>

                                {/* FUTURO: cancelar / editar */}
                                <span className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white/70">
                                    Activa
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
