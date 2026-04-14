"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User } from "lucide-react"; 
import SearchBar from "./SearchBar"; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const cartItemsCount = 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

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

      <div className="hidden md:flex items-center gap-8 font-body text-base font-semibold text-planthia-dark/70">
        <Link href="/" className={`${isActive("/") ? "text-planthia-green" : "hover:text-planthia-green"} transition-colors`}>
          Inicio
        </Link>
        <Link href="/tienda" className={`${isActive("/tienda") ? "text-planthia-green" : "hover:text-planthia-green"} transition-colors`}>
          Tienda
        </Link>
        <Link href="/" className={`${isActive("/cuidados") ? "text-planthia-green" : "hover:text-planthia-green"} transition-colors`}>
          Cuidados
        </Link>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 text-planthia-dark">
        <SearchBar />

        <button className="hover:text-planthia-green transition-colors cursor-pointer relative">
          <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-planthia-green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartItemsCount}
            </span>
          )}
        </button>
        <button className="hover:text-planthia-green transition-colors cursor-pointer">
          <User size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      </div>
    </nav>
  );
}