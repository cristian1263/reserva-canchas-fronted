'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
   <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-green-900 px-4 py-3 text-white shadow-md">

      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>

        <span className="font-bold">AgendaGol</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="hidden text-sm md:block">
            {user.email}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="rounded bg-green-700 px-3 py-1 text-sm hover:bg-green-900"
        >
          Salir
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <nav className="absolute left-0 top-14 w-full bg-green-900 p-4 ">
          <ul className="space-y-3">
            <li>
              <a href="/canchas" className="block">
                Canchas
              </a>
            </li>
            <li>
              <a href="/reservas" className="block">
                Mis reservas
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
