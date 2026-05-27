//src/app/layout.tsx
import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Toaster } from 'sonner';
import { CartDrawer } from "@/components/shop/CartDrawer";
import NewsletterPopup from "@/components/layout/NewsletterPopup";
import { FavoritesProvider } from '@/context/FavoritesContext';
import { Suspense } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Planthia | Tienda de Plantas",
  description: "Tu jungla urbana a un click de distancia. Descubre nuestra exclusiva colección de plantas de interior, diseñadas para transformar tu hogar en un oasis verde. Desde suculentas minimalistas hasta exuberantes helechos, cada planta es seleccionada por su belleza y facilidad de cuidado. Embellece tu espacio con Planthia, donde la naturaleza y el estilo se encuentran.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${manrope.variable} ${inter.variable}`}>
      <body className=" relative font-body antialiased bg-planthia-cream text-planthia-dark">
        <FavoritesProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <CartDrawer />
          <main className="relative">
            {children}
          </main>
          <Footer />
          <Suspense fallback={null}>
            <NewsletterPopup />
          </Suspense>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#FDFCF0',
                color: '#1C1C1C',
                border: '1px solid rgba(28, 28, 28, 0.1)',
                fontFamily: 'var(--font-manrope)',
              },
            }}
          />
        </FavoritesProvider>
      </body>
    </html>
  );
}