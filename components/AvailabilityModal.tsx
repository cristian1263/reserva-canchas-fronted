'use client';

import { useEffect, useState } from 'react';
import { Field } from '@/types';
import AlertModal from '@/components/AlertModal';
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
  const lastHour = endHour - duration;

  for (let hour = startHour; hour <= lastHour; hour++) {
    if (currentHour !== undefined && hour <= currentHour) continue;
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
  tomorrow.setDate(today.getDate() + 1);

  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(1);

  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    type: 'info',
  });

  async function loadAvailability(selectedDate: string) {
    setLoading(true);
    try {
      const data = await getAvailability(field.id, selectedDate, token);

      const [y, m, d] = selectedDate.split('-').map(Number);
      const selectedDateObj = new Date(y, m - 1, d);

      const now = new Date();
      const isToday =
        selectedDateObj.toDateString() === now.toDateString();

      const currentHour = isToday ? now.getHours() : undefined;

      let availableSlots: string[] = [];

      if (!Array.isArray(data) || data.length === 0) {
        availableSlots = generateTimeSlots(10, 22, duration, currentHour);
      } else {
        const lastHour = 22 - duration;
        availableSlots = data.filter((slot) => {
          const h = parseInt(slot.split(':')[0], 10);
          if (currentHour !== undefined && h <= currentHour) return false;
          return h <= lastHour;
        });
      }

      setSlots(availableSlots);
      setSelectedSlot('');
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve() {
    if (!date || !selectedSlot) {
      setAlert({
        open: true,
        message: 'Selecciona fecha y horario',
        type: 'info',
      });
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


      setAlert({
        open: true,
        message: 'Reserva creada con éxito',
        type: 'success',
      });
      await loadAvailability(date);
      
    } catch {
      setAlert({
        open: true,
        message: 'Ese horario ya está reservado',
        type: 'error',
      });
    }
  }

  useEffect(() => {
    if (date) loadAvailability(date);
  }, [duration]);



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-6xl overflow-y-auto rounded-2xl bg-slate-950 shadow-2xl">
        {/* GRADIENT BACKGROUND */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-900/90 to-sky-900/90" />

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 p-5 text-white">
          <h2 className="text-xl font-extrabold">Reserva de cancha</h2>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid gap-6 p-6 md:grid-cols-12 text-white">
          {/* INFO */}
          <aside className="md:col-span-4 rounded-xl bg-white/10 p-5 backdrop-blur">
            <h3 className="text-lg font-semibold">{field.name}</h3>

            <p className="mt-1 text-sm text-white/70">
              📍 {field.location}
            </p>

            <div className="mt-4 space-y-1 text-sm text-white/80">
              <p>👥 Capacidad: {field.capacity}</p>
              <p>
                ⏰ {field.opening_time} – {field.closing_time}
              </p>
            </div>

            <p className="mt-4 text-2xl font-bold text-emerald-300">
              ${field.price_per_hour} / hora
            </p>

            <p className="mt-3 text-sm text-white/70">
              {field.description}
            </p>
          </aside>

          {/* RESERVA */}
          <section className="md:col-span-8 rounded-xl bg-white/5 p-5 backdrop-blur">
            <h3 className="mb-4 text-lg font-semibold">
              Selecciona tu reserva
            </h3>

            {/* FECHA */}
            <div className="mb-4">
              <label className="mb-1 block text-sm">Fecha</label>
              <input
                type="date"
                min={formatDate(tomorrow)}
                max={formatDate(maxDate)}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  loadAvailability(e.target.value);
                }}
                className="w-full rounded-lg bg-white/10 p-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* HORARIOS */}
            {loading && <p className="text-sm opacity-70">Cargando horarios…</p>}

            {!loading && slots.length > 0 && (
              <div className="mb-4">
                <label className="mb-2 block text-sm">Horario</label>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-lg px-4 py-2 text-sm transition ${selectedSlot === slot
                        ? 'bg-gradient-to-r from-emerald-600 to-sky-700'
                        : 'bg-white/10 hover:bg-white/20'
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DURACIÓN */}
            <div className="mb-4">
              <label className="mb-2 block text-sm">Duración</label>
              <div className="flex gap-3">
                {[1, 2].map((h) => (
                  <button
                    key={h}
                    onClick={() => setDuration(h)}
                    className={`rounded-lg px-4 py-2 ${duration === h
                      ? 'bg-gradient-to-r from-emerald-600 to-sky-700'
                      : 'bg-white/10'
                      }`}
                  >
                    {h} hora{h > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleReserve}
              disabled={!selectedSlot}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-sky-700 py-3 font-semibold text-white disabled:opacity-40"
            >
              Reservar
            </button>
          </section>
        </div>
      </div>
      <AlertModal
        open={alert.open}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </div>
  );
}
