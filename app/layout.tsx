import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AuthLayout from '@/components/AuthLayout';

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
      <body>
        <AuthProvider>
          <AuthLayout>
            {children}
          </AuthLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
