import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Planthia | Store",
  description: "Venta de plantas ornamentales",
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
      </body>
    </html>
  );
}