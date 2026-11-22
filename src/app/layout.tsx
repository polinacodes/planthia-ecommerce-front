//src/app/layout.tsx
import type { Metadata } from "next";
import DiscountFromUrl from "@/components/DiscountFromUrl";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Toaster } from 'sonner';
import { CartDrawer } from "@/components/shop/CartDrawer";
import NewsletterPopup from "@/components/layout/NewsletterPopup";
import { FavoritesProvider } from '@/context/FavoritesContext';
import { Suspense } from "react";
import { SITE_URL } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const DESCRIPTION =
  "Plantas de interior, exterior y aromáticas, sustratos y todo lo que necesitan para crecer. Guía de cuidados para cada planta y envíos a todo el país.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Cada página pone su título y se le agrega " | Planthia" (la home usa el de "default")
  title: {
    default: "Planthia | Tienda de plantas online",
    template: "%s | Planthia",
  },
  description: DESCRIPTION,
  applicationName: "Planthia",
  keywords: ["plantas", "tienda de plantas", "plantas de interior", "plantas de exterior", "aromáticas", "sustratos", "vivero online", "Argentina"],
  alternates: { canonical: "/" },
  // Vista previa al compartir el link (WhatsApp, redes, etc.)
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Planthia",
    title: "Planthia | Tienda de plantas online",
    description: DESCRIPTION,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Planthia, tienda de plantas online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planthia | Tienda de plantas online",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
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
          {/* Mientras llega el nav se reserva su alto (72px): si no, todo bajaba de golpe al aparecer */}
          <Suspense fallback={<div className="h-[72px]" aria-hidden="true" />}>
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
          {/* Cupón por link (?cupon=...): lo guarda para el checkout */}
          <DiscountFromUrl />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#FDFCF0',
                color: '#1C1C1C',
                border: '1px solid rgba(28, 28, 28, 0.1)',
                fontFamily: 'var(--font-headline)',
              },
            }}
          />
        </FavoritesProvider>
      </body>
    </html>
  );
}