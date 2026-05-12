//src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Settings, Menu, X, Heart } from "lucide-react";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '@/hooks/useCart';
import { getToken, getUser, removeToken, removeUser, UserData } from "@/lib/auth";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
  }, [pathname, searchParams]);

  const handleLogout = () => {
    removeToken();
    removeUser();
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/shop?type=plantas") return pathname === "/shop" && searchParams.get("type") === "plantas";
    if (href === "/shop?type=cuidados") return pathname === "/shop" && searchParams.get("type") === "cuidados";
    return false;
  };

  return (
    <>
      <nav
        className={` sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-planthia-cream/60 backdrop-blur-md shadow-sm"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 sm:px-12 py-6">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-planthia-dark hover:text-planthia-green transition-colors mr-4"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="hidden md:block text-2xl font-headline font-extrabold text-planthia-dark">
            Planthia<span className="text-planthia-green">.</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 font-body text-base font-semibold text-planthia-dark/70">
          <Link href="/" className={`${isActive("/") ? "text-planthia-green" : "hover:text-planthia-green"} transition-colors`}>
            Inicio
          </Link>
          <Link href="/shop?type=plantas" className={`${isActive("/shop?type=plantas") ? "text-planthia-green" : "hover:text-planthia-green"} transition-colors`}>
            Plantas
          </Link>
          <Link href="/shop?type=cuidados" className={`${isActive("/shop?type=cuidados") ? "text-planthia-green" : "hover:text-planthia-green"} transition-colors`}>
            Cuidados
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-planthia-dark">
          <SearchBar />

           <button
            // onClick={}
            className="hidden md:block hover:text-planthia-green transition-colors cursor-pointer relative">
            <Heart size={20} className="sm:w-[22px] sm:h-[22px]" />
          </button>


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
        </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden" />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-planthia-green text-planthia-cream z-[70] md:hidden p-8 flex flex-col shadow-2xl"
            >
              {/* Logo */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex flex-col">
                  <span className="text-3xl font-headline font-extrabold leading-none">Planthia<span className="text-planthia-cream/50">.</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className=" hover:bg-white/20 transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Listado de Navegación */}
              <div className="flex flex-col gap-5 text-lg font-bold font-body">

                <Link href="/" className="hover:opacity-80 transition-opacity">Inicio</Link>
                <Link href="/shop?type=plantas" className="hover:opacity-80 transition-opacity">Plantas</Link>
                <Link href="/shop?type=cuidados" className="hover:opacity-80 transition-opacity">Cuidados</Link>

                <div className="h-px bg-planthia-cream/20 my-2" />

                <button onClick={() => { setIsMobileMenuOpen(false); toggleCart(); }} className="flex items-center gap-4 w-full group text-left">
                  <div className=" group-hover:bg-white/20 transition-colors">
                    <ShoppingCart size={18} />
                  </div>
                  <span className="flex-1">Carrito</span>
                  <span className="bg-planthia-cream text-planthia-green text-xs px-2 py-0.5 rounded-full font-extrabold">
                    {totalItems}
                  </span>
                </button>

                <Link href="/wishlist" className="flex items-center gap-4 w-full group">
                  <div className=" group-hover:bg-white/20 transition-colors">
                    <Heart size={18} className="fill-current" />
                  </div>
                  Favoritos
                </Link>

                <div className="h-px bg-planthia-cream/20 my-4" />

                {/* Sección Usuario */}
                {!user ? (
                  <Link href="/login" className="mt-4 bg-planthia-cream text-planthia-green py-4 rounded-xl text-center font-extrabold shadow-lg active:scale-95 transition-all">
                    Ingresar
                  </Link>
                ) : (
                  <div className="space-y-6">
                    <Link href="/account" className="flex items-center gap-4 w-full group">
                      <div className=" group-hover:bg-white/20 transition-colors">
                        <User size={18} />
                      </div>
                      Mi Cuenta
                    </Link>

                    <button onClick={handleLogout} className="flex items-center gap-4 w-full text-planthia-cream group text-left">
                      <div className=" group-hover:bg-white/20 transition-colors">
                        <LogOut size={18} />
                      </div>
                      Salir
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}