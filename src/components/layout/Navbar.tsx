"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, User } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`flex items-center justify-between px-3 md:px-8 lg:px-12 py-6 sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-planthia-cream/60 backdrop-blur-md shadow-sm"
        : "bg-transparent"
        }`}
    >
      <Link href="/" className="text-2xl font-headline font-extrabold text-planthia-dark">
        Planthia<span className="text-planthia-green">.</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 font-body text-sm font-semibold text-planthia-dark/70">
        <Link href="/" className="text-planthia-green">Inicio</Link>
        <Link href="/about" className="hover:text-planthia-green transition-colors">Tienda</Link>
        <Link href="/products" className="hover:text-planthia-green transition-colors">Cuidados</Link>
        <Link href="/news" className="hover:text-planthia-green transition-colors">Contacto</Link>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 text-planthia-dark">
        <button className="hover:text-planthia-green transition-colors cursor-pointer">
          <Search size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
        <button className="hover:text-planthia-green transition-colors cursor-pointer relative">
          <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
          <span className="absolute -top-2 -right-2 bg-planthia-green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            0
          </span>
        </button>
        <button className="hover:text-planthia-green transition-colors cursor-pointer">
          <User size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      </div>
    </nav>
  );
}