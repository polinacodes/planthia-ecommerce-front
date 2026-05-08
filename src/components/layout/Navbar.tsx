"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Settings } from "lucide-react";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '@/hooks/useCart';
import { getToken, getUser, removeToken, removeUser, UserData } from "@/lib/auth";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cart = useCart((state) => state.cart);
  const toggleCart = useCart((state) => state.toggleCart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const activeUser = getUser();
      const token = getToken();
      if (activeUser && token) {
        setUser(activeUser);
      } else {
        setUser(null);
      }
    };
    checkUser();
  }, [pathname, searchParams]);

  const handleLogout = () => {
    removeToken();
    removeUser();
    setUser(null);
    setIsUserMenuOpen(false);
    window.location.href = "/";
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/tienda?type=plantas") return pathname === "/tienda" && searchParams.get("type") === "plantas";
    if (href === "/tienda?type=cuidados") return pathname === "/tienda" && searchParams.get("type") === "cuidados";
    return false;
  };

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
        <Link href="/tienda?type=plantas" className={`${isActive("/tienda?type=plantas") ? "text-planthia-green" : "hover:text-planthia-green"} transition-colors`}>
          Plantas
        </Link>
        <Link href="/tienda?type=cuidados" className={`${isActive("/tienda?type=cuidados") ? "text-planthia-green" : "hover:text-planthia-green"} transition-colors`}>
          Cuidados
        </Link>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 text-planthia-dark">
        <SearchBar />

        <button
          onClick={toggleCart}
          className="hover:text-planthia-green transition-colors cursor-pointer relative">
          <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px]" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-planthia-green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>

        {/* Contenedor del Usuario */}
        <div
          className="relative hidden md:block"
          onMouseEnter={() => user && setIsUserMenuOpen(true)}
          onMouseLeave={() => user && setIsUserMenuOpen(false)}
        >
          {!user ? (
            <Link
              href="/login"
              className="hover:text-planthia-green transition-colors cursor-pointer flex items-center p-1"
            >
              <User size={20} className="sm:w-[22px] sm:h-[22px]" />
            </Link>
          ) : (
            <>
              <button
                className="hover:text-planthia-green transition-colors cursor-pointer focus:outline-none flex items-center p-1"
              >
                <User size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0.95 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      transformOrigin: 'top'
                    }}
                    className="absolute right-[-3rem] top-[3.7rem] w-44 bg-planthia-cream/70 shadow-xl rounded-b-xl rounded-t-none p-2 z-40 border-x border-b border-white/20 origin-top-right"
                  >
                    <div className="p-2 space-y-1">
                      <Link
                        href="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-planthia-dark/90 hover:text-planthia-green transition-all"
                      >
                        <Settings size={16} />
                        Mi Cuenta
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-planthia-dark/90 hover:text-red-500 transition-all cursor-pointer"
                      >
                        <LogOut size={16} />
                        Salir
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Icono usuario para Mobile */}
        <button className="md:hidden hover:text-planthia-green transition-colors cursor-pointer">
          <User size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      </div>
    </nav>
  );
}