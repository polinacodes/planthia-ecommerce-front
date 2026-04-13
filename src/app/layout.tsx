import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

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
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}