import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'AgendaGol',
  description: 'Sistema de reservas de canchas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
