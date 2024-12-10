import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import React from 'react';
import AppContext from '@/Context/AppContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Gestión de Calidad',
  description:
    'Sistema para la gestioón de calidad a través de retroalimentación de los usuarios',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <body className={`${inter.className} min-h-screen bg-sidebar`}>
        <AppContext>{children}</AppContext>
      </body>
    </html>
  );
}
