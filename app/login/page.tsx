'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.replace('/canchas');
    } catch {
      setError('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  } 

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950">

      {/* LEFT – IMAGE / BRAND */}
      <section className="relative hidden md:flex items-center justify-center overflow-hidden">
        

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-sky-900/90" />

        <div className="relative z-10 text-white text-center px-8">
          <h1 className="text-4xl font-extrabold mb-3">AgendaGol</h1>
          <p className="text-lg opacity-90">
            Reserva tu cancha en segundos
          </p>
        </div>
      </section>

      {/* RIGHT – LOGIN */}
      <section className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-2xl bg-white/5 p-8 backdrop-blur-xl shadow-xl border border-white/10"
        >
          <h2 className="mb-6 text-2xl font-bold text-white text-center">
            Iniciar sesión
          </h2>

          {error && (
            <p className="mb-4 rounded bg-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 py-3 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesion'}
          </button>
        </form>
      </section>
    </main>
  );
}
