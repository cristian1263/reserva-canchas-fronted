'use client';

import { useEffect, useState } from 'react';
import { Field } from '@/types';
import { getAvailability } from '@/services/cancha.service';
import { createReservation } from '@/services/reserva.service';

type Props = {
    field: Field;
    token: string;
    onClose: () => void;
};

/* =======================
   HELPERS
======================= */
function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
}

function generateTimeSlots(
    startHour = 10,
    endHour = 22,
    duration = 1,
    currentHour?: number
): string[] {
    const slots: string[] = [];
    const lastHour = endHour - duration; // última hora válida según duración
    for (let hour = startHour; hour <= lastHour; hour++) {
        if (currentHour !== undefined && hour <= currentHour) continue; // omite horas pasadas
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
}


/* =======================
   COMPONENT
======================= */
export default function AvailabilityModal({ field, token, onClose }: Props) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1); // día siguiente

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    const [date, setDate] = useState('');
    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState(1);

    async function loadAvailability(selectedDate: string) {
        setLoading(true);
        try {
            const data = await getAvailability(field.id, selectedDate, token); // slots libres desde backend

            let availableSlots: string[] = [];

            const [year, month, day] = selectedDate.split('-').map(Number);
            const selectedDateObj = new Date(year, month - 1, day);

            const today = new Date();
            const isToday =
                selectedDateObj.getFullYear() === today.getFullYear() &&
                selectedDateObj.getMonth() === today.getMonth() &&
                selectedDateObj.getDate() === today.getDate();

            const currentHour = isToday ? today.getHours() : undefined;

            if (!Array.isArray(data) || data.length === 0) {
                // Si no hay datos, generamos slots base
                availableSlots = generateTimeSlots(10, 22, duration, currentHour);
            } else {
                // Filtramos horas pasadas si es hoy
                availableSlots = data.filter((slot) => {
                    if (currentHour !== undefined) {
                        const slotHour = parseInt(slot.split(':')[0], 10);
                        return slotHour > currentHour;
                    }
                    return true;
                });

                // Ajustar según duración
                const lastHour = 22 - duration;
                availableSlots = availableSlots.filter(slot => parseInt(slot.split(':')[0], 10) <= lastHour);
            }

            setSlots(availableSlots);
            setSelectedSlot('');
        } catch {
            setSlots(generateTimeSlots(10, 22, duration));
        } finally {
            setLoading(false);
        }
    }


    async function handleReserve() {
        if (!date || !selectedSlot) {
            alert('Selecciona fecha y horario');
            return;
        }

        // Validación fecha futura respecto a ahora
        const now = new Date();

        const [hour, minute] = selectedSlot.split(':').map(Number);
        const [year, month, day] = date.split('-').map(Number);

        const reservationDateTime = new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            0,
            0
        );
        if (reservationDateTime <= now) {
            alert('No puedes reservar para una hora pasada. Selecciona un horario futuro.');
            return;
        }

        try {
            await createReservation(
                field.id,
                date,
                selectedSlot,
                duration,
                token
            );

            alert('Reserva creada con éxito');
            await loadAvailability(date);

        } catch (error: any) {
            alert('Ya se encuentra reservada' );
        }
    }

    useEffect(() => {
        if (date) {
            loadAvailability(date);
        }
    }, [duration]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-5xl rounded-xl bg-white p-6">

                {/* HEADER */}
                <div className="mb-4 flex justify-between">
                    <h2 className="text-xl font-bold">Reserva de cancha</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">

                    {/* INFO CANCHA */}
                    <aside className="rounded-lg bg-gray-100 p-4 md:col-span-4">
                        <h3 className="mb-2 text-lg font-semibold">{field.name}</h3>
                        <p className="text-sm text-gray-600">📍 {field.location}</p>
                        <p className="mt-2 text-sm">👥 Capacidad: {field.capacity}</p>
                        <p className="mt-2 text-sm">
                            ⏰ {field.opening_time} - {field.closing_time}
                        </p>
                        <p className="mt-4 text-lg font-bold text-green-700">
                            ${field.price_per_hour} / hora
                        </p>
                        <p className="mt-3 text-sm text-gray-600">
                            {field.description}
                        </p>
                    </aside>

                    {/* RESERVA */}
                    <section className="rounded-lg border p-4 md:col-span-8">
                        <h3 className="mb-4 text-lg font-semibold">
                            Selecciona tu reserva
                        </h3>

                        {/* FECHA */}
                        <div className="mb-4">
                            <label className="mb-1 block text-sm">Fecha</label>
                            <input
                                type="date"
                                min={formatDate(tomorrow)} // ahora no se puede seleccionar el día actual
                                max={formatDate(maxDate)}
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    loadAvailability(e.target.value);
                                }}
                                className="w-full rounded border p-2"
                            />
                        </div>

                        {/* HORARIOS */}
                        {loading && <p>Cargando horarios...</p>}

                        {!loading && slots.length > 0 && (
                            <div className="mb-4">
                                <label className="mb-2 block text-sm">Horario</label>
                                <div className="flex flex-wrap gap-2">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`rounded px-4 py-2 text-sm ${selectedSlot === slot
                                                ? 'bg-green-700 text-white'
                                                : 'bg-green-100 hover:bg-green-200'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* DURACION */}
                        <div className="mb-4">
                            <label className="block text-sm mb-2">Duración</label>
                            <div className="flex gap-2">
                                {[1, 2].map((h) => (
                                    <button
                                        key={h}
                                        onClick={() => setDuration(h)}

                                        className={`rounded px-4 py-2 ${duration === h
                                            ? 'bg-green-700 text-white'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        {h} hora{h > 1 ? 's' : ''}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            disabled={!selectedSlot}
                            onClick={handleReserve}
                            className="mt-6 w-full rounded bg-green-700 py-2 font-semibold text-white disabled:bg-gray-300"
                        >
                            Reservar
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}
