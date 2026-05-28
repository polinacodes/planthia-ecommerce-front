"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Settings, Menu, X, Heart, Trash2 } from "lucide-react";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/context/FavoritesContext';
import { usePlants } from '@/hooks/usePlants';
import { getToken, getUser, removeToken, removeUser, UserData } from "@/lib/auth";
import { toast } from "sonner";


function NavbarContent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isWishlistMenuOpen, setIsWishlistMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cart = useCart((state) => state.cart);
  const toggleCart = useCart((state) => state.toggleCart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const { favorites, toggleFavorite } = useFavorites();
  const { plants } = usePlants();

  const previewFavorites = useMemo(() => {
    if (!plants || !favorites || !user) return [];
    const favoriteIds = new Set(favorites.map(fav => Number(fav.productId)));
    return plants.filter((plant) => favoriteIds.has(Number(plant.id)));
  }, [plants, favorites, user]);

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

  const handleRemoveFavorite = async (id: number, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(id);
    toast.error(`${name} eliminada de favoritos`);
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
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 sm:px-12 py-4">
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

          {/*  DROPDOWN DE FAVORITOS (DESKTOP) */}
          {user && (
            <div 
              className="relative hidden md:block"
              onMouseEnter={() => setIsWishlistMenuOpen(true)}
              onMouseLeave={() => setIsWishlistMenuOpen(false)}
            >
              <button
                type="button"
                className="hover:text-planthia-green transition-colors cursor-pointer block p-1 relative"
              >
                <Heart size={20} className="sm:w-[22px] sm:h-[22px]" />
                {previewFavorites.length > 0 && (
                  <span className="absolute top-0 right-0 bg-planthia-green w-2 h-2 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {isWishlistMenuOpen && (
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
                    // className="absolute right-[-4rem] top-[3.7rem] w-80 bg-planthia-cream/90 shadow-xl rounded-b-xl border-x border-b border-planthia-dark/10 p-4 z-40 origin-top"
                    className="absolute right-[-4rem] top-[3rem] mt-3 w-80 bg-planthia-cream/90 shadow-xl rounded-xl border border-white/20 p-4 z-40 origin-top before:content-[''] before:absolute before:bottom-full before:right-[4.45rem] before:border-[8px] before:border-transparent before:border-b-planthia-cream/90"
                  >
                    {previewFavorites.length === 0 ? (
                      <div className="py-6 text-center text-sm text-planthia-dark/60 italic font-body">
                        Tu lista está vacía 
                      </div>
                    ) : (
                      <>
                        {/* Contenedor scrolleable ajustado para ~6 elementos */}
                        <div className="max-h-[340px] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-planthia-green/20">
                          {previewFavorites.map((product) => (
                            <div key={product.id} className="flex items-center gap-3 bg-white/40 p-2 rounded-lg border border-planthia-dark/5 group/item">
                              <Link href={`/shop/${product.id}`} className="relative w-12 h-12 rounded-md overflow-hidden bg-white/80 flex-shrink-0">
                                <Image 
                                  src={product.image} 
                                  alt={product.name} 
                                  fill 
                                  className="object-cover"
                                />
                              </Link>
                              
                              <div className="flex-1 min-w-0">
                                <Link href={`/shop/${product.id}`} className="block">
                                  <h4 className="text-xs font-bold text-planthia-dark hover:text-planthia-green transition-colors truncate">
                                    {product.name}
                                  </h4>
                                </Link>
                                <span className="text-xs font-extrabold text-[#5B823B] block mt-0.5">
                                  ${product.price.toLocaleString('es-AR')}
                                </span>
                              </div>

                              <button
                                onClick={(e) => handleRemoveFavorite(Number(product.id), product.name, e)}
                                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all flex-shrink-0"
                                title="Eliminar"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Botón Ver Todos */}
                        <div className="border-t border-planthia-dark/10 mt-3 pt-3">
                          <Link 
                            href="/wishlist"
                            onClick={() => setIsWishlistMenuOpen(false)}
                            className="block text-center w-full bg-planthia-green hover:bg-planthia-dark text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Ver todos
                          </Link>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

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
                      // className="absolute right-[-3rem] top-[3.7rem] w-44 bg-planthia-cream/90 shadow-xl rounded-b-xl rounded-t-none p-2 z-40 border-x border-b border-white/20 origin-top-right"
                      className="absolute right-[-3rem] top-[3rem] mt-3 w-44 bg-planthia-cream/90 shadow-xl rounded-xl p-2 z-40 border border-white/20 origin-top-right before:content-[''] before:absolute before:bottom-full before:right-[3.35rem] before:border-[8px] before:border-transparent before:border-b-planthia-cream/90"
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

                {user && (
                  <Link href="/wishlist" className="flex items-center gap-4 w-full group">
                    <div className=" group-hover:bg-white/20 transition-colors">
                      <Heart size={18} className="fill-current" />
                    </div>
                    Favoritos
                  </Link>
                )}

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

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}