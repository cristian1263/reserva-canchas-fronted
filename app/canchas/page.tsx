'use client';

import { useEffect, useState } from 'react';
import { getFields } from '@/services/cancha.service';
import { Field } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CanchasPage() {
    const { token } = useAuth();
    const router = useRouter();

    const [fields, setFields] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadFields() {
            try {
                const data = await getFields(token || undefined);
                setFields(data);
            } catch (err) {
                setError('No se pudieron cargar las canchas');
            } finally {
                setLoading(false);
            }
        }

        loadFields();
    }, [token]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Cargando canchas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 p-6">
            <h1 className="mb-6 text-2xl font-bold text-white">
                Canchas disponibles
            </h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {fields.map((field) => (
                    <div
                        key={field.id}
                        className="rounded-xl bg-white/60 p-4 shadow backdrop-blur"
                    >
                        <h2 className="text-lg font-semibold">{field.name}</h2>
                        <p className="text-sm text-gray-700">{field.location}</p>
                        <p className="mt-2 font-bold">
                            ${field.price_per_hour} / hora
                        </p>
                        <p className="text-sm text-gray-600">
                            ⏰ {field.opening_time} - {field.closing_time}
                        </p>
                        <p className="text-sm">
                            👥 Capacidad: {field.capacity}
                        </p>

                        <button
                            onClick={() => router.push(`/canchas/${field.id}`)}
                            className="mt-4 w-full rounded bg-green-700 py-2 text-white hover:bg-green-800 transition"
                        >
                            Ver disponibilidad
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}
