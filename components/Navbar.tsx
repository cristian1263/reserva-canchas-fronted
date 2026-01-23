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
        <header className="fixed top-0 left-0 z-50 w-full bg-slate-900/90 backdrop-blur shadow-lg">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-white">

                {/* LEFT */}
                <div className="flex items-center gap-6">
                    {/* Hamburguesa (solo mobile) */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="text-2xl text-green-400 md:hidden"
                    >
                        ☰
                    </button>

                    <span className="text-lg font-bold tracking-wide">
                        AgendaGol
                    </span>

                    {/* DESKTOP MENU */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <a
                            href="/canchas"
                            className="text-sm text-slate-300 hover:text-white transition"
                        >
                            Canchas
                        </a>
                        <a
                            href="/mis-reservas"
                            className="text-sm text-slate-300 hover:text-white transition"
                        >
                            Mis reservas
                        </a>
                    </nav>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="hidden text-sm text-slate-400 md:block">
                            {user.email}
                        </span>
                    )}

                    <button
                        onClick={handleLogout}
                        className=" rounded-lg
    border border-white/20
    bg-white/10
    px-4 py-1.5
    text-sm
    text-white
    backdrop-blur
    transition
    hover:bg-white/20
  "
                    >
                        Cerrar Sesion
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <nav className="md:hidden border-t border-white/10 bg-slate-900 px-4 py-4 text-white">
                    <ul className="space-y-3">
                        <li>
                            <a
                                href="/canchas"
                                className="block rounded px-2 py-1 hover:bg-white/10"
                                onClick={() => setOpen(false)}
                            >
                                Canchas
                            </a>
                        </li>
                        <li>
                            <a
                                href="/mis-reservas"
                                className="block rounded px-2 py-1 hover:bg-white/10"
                                onClick={() => setOpen(false)}
                            >
                                Mis reservas
                            </a>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
