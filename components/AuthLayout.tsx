'use client';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      {token && <Navbar />}
      {children}
    </>
  );
}
