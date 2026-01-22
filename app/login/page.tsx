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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

   try {
      await login(email, password);

      setTimeout(() => {
        router.replace('/canchas');
      }, 0);

    } catch (err) {
      setError('Credenciales incorrectas');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br  from-emerald-800 to-green-700">
      <form
        onSubmit={handleSubmit} 
        className="w-full max-w-sm rounded-xl bg-white/30 p-6 shadow-xl backdrop-blur-md"
      >
        <h1 className="mb-4 text-center text-xl font-bold text-white">Iniciar sesión</h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded border border-white/40 bg-white/70 p-2 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
         className="mb-4 w-full rounded border border-white/40 bg-white/70 p-2 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="mb-1 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded bg-green-700 py-2 font-semibold text-white hover:bg-green-800 transition"
        >
          Entrar
        </button>

       

      </form>
    </main>
  );

}
