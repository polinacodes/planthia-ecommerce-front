"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { usePlants } from '@/hooks/usePlants';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Droplets, Thermometer, ArrowUp, Heart, PawPrint, Ruler, Package, HandHeart } from "lucide-react";
import Link from 'next/link'
import ProductCardShop from '@/components/products/ProductCardShop';
import EmptyState from '@/components/products/EmptyState';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'sonner';

// --- SUB-COMPONENTES AUXILIARES ---
const CareItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex gap-4 items-start">
    <Icon size={20} strokeWidth={1.5} className="text-planthia-dark/50 flex-shrink-0" />
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50 mb-1">{label}</span>
      <span className="text-xs font-bold text-planthia-dark/80 uppercase break-words">{value}</span>
    </div>
  </div>
);

export default function ProductPage() {
  const params = useParams();
  const id = params.id;
  const { plants, loading } = usePlants();
  const { addItem, cart, removeItem, updateQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [productsToShow, setProductsToShow] = useState(3);

  const product = useMemo(() => {
    if (!plants) return undefined;
    return plants.find((p) => p.id.toString() === id?.toString());
  }, [plants, id]);

  const active = useMemo(() => {
    if (!product) return false;
    return isFavorite(product.id);
  }, [product, isFavorite]);

  const stockDisponible = useMemo(() => {
    if (!product) return 0;

    const p = product.attributes || product;

    if (selectedVariant) {
      return selectedVariant.stock || 0;
    }
    return p.stock || 0;
  }, [product, selectedVariant]);

  const isOutOfStock = stockDisponible <= 0;

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [product]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setProductsToShow(2);
      else if (width < 1024) setProductsToShow(3);
      else setProductsToShow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getHexColor = (color: string) => {
    const colors: { [key: string]: string } = {
      rojo: "#e11d48", rosa: "#fb7185", "rosa intenso": "#be123c",
      "rosa palido": "#fda4af", violeta: "#7c3aed", magenta: "#d946ef",
      blanco: "#ffffff", naranja: "#f97316", amarillo: "#facc15",
      salmon: "#fa8072", burdeus: "#800020", beige: "#D4C1A9",
      "rosa pastel": "#DBB5B1", "verde pastel": "#90A67F", floral: "#D36658",
    };
    return colors[color.toLowerCase()] || "#cbd5e1";
  };

  const relatedProducts = useMemo(() => {
    if (!product || !plants) return [];
    const currentSub = product.subcategory?.name;
    return plants
      .filter(p => p.subcategory?.name === currentSub && p.id !== product.id)
      .slice(0, productsToShow);
  }, [product, plants, productsToShow]);

  const uniqueVariants = useMemo(() => {
    if (!product?.variants) return [];
    const seen = new Set();
    return product.variants.filter((v: any) => {
      const key = v.color.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [product]);

  if (loading) return null;

  if (!product) {
    return (
      <main className="min-h-screen bg-planthia-cream">
        <EmptyState
          title="La planta que buscas no está en nuestro jardín."
          description={<p>El ID <span className="font-bold text-[#5B823B]">{id}</span> no existe o fue movido,</p>}
        />
      </main>
    );
  }

  const VariantSelector = () => {
    if (!uniqueVariants || uniqueVariants.length === 0) return null;
    return (
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          {uniqueVariants.map((variant: any) => (
            <button
              key={variant.color}
              onClick={() => {
                setSelectedImage(variant.image);
                setSelectedVariant(variant);
              }}
              className={`w-5 h-5 rounded-full border shadow-md transition-all duration-300 ${selectedImage === variant.image
                ? 'scale-125 border-planthia-dark/30'
                : 'border-transparent opacity-70 hover:opacity-100 hover:scale-110'
                }`}
              style={{ backgroundColor: getHexColor(variant.color) }}
              title={variant.color}
            />
          ))}
        </div>
        <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50">
          Colores disponibles
        </span>
      </div>
    );
  };

  const currentUniqueId = selectedVariant
    ? `${product.id}-${selectedVariant.color.toLowerCase()}`
    : product.id;

  const cartItem = cart.find((item: any) => item.id === currentUniqueId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    const uniqueId = selectedVariant
      ? `${product.id}-${selectedVariant.color.toLowerCase()}`
      : product.id;

    const wasAdded = addItem({
      id: uniqueId,
      name: product.name,
      color: selectedVariant?.color,
      price: product.price,
      image: selectedImage || product.image,
      quantity: 1,
      stock: stockDisponible
    });

    if (wasAdded) {
      toast.success(`${product.name} agregada`);
    }
  };

  return (
    <main className="min-h-screen bg-planthia-cream pt-6 md:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. BREADCRUMBS */}
        <nav className="text-[10px] uppercase tracking-[0.2em] text-planthia-dark/60 mb-4 flex flex-wrap gap-x-2">
          <Link
            href={`/shop?type=${product.type}`}
            className="hover:text-planthia-green transition-colors whitespace-nowrap"
          >
            {product.type === 'plantas' ? 'Plantas' : 'Cuidados'}
          </Link>
          <span className="text-planthia-dark/30">/</span>
          <Link
            href={`/shop?type=${product.type}&category=${product.subcategory?.name?.toLowerCase() || 'todas'}`}
            className="hover:text-planthia-green transition-colors whitespace-nowrap"
          >
            {product.subcategory?.name || 'Sin categoría'}
          </Link>
          <span className="text-planthia-dark/30">/</span>
          <span className="text-planthia-dark font-bold truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[600px] items-start">
          {/* COLUMNA IZQUIERDA: VISUALS */}
          <div className="flex flex-col p-2">
            <div className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[650px] bg-planthia-cream rounded-[2rem] lg:rounded-[3rem] overflow-hidden">
              {product.petFriendly && (
                <div className="absolute top-4 sm:top-8 left-4 sm:left-6 z-10 bg-planthia-light-green/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                  <PawPrint size={14} className="text-planthia-dark flex-shrink-0" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-planthia-dark">Pet Friendly</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full h-full"
                >
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                      className="object-contain p-2 transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-planthia-cream/50 animate-pulse rounded-[2rem] lg:rounded-[3rem]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="lg:hidden flex justify-center py-4">
              <VariantSelector />
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO y COMPRA */}
          <div className="flex flex-col -mt-8 lg:mt-16 justify-center space-y-6 lg:space-y-8 lg:pl-12">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-manrope text-planthia-dark leading-tight break-words">
                {product.name}
              </h1>
              <p className="text-planthia-dark/60 text-base lg:text-lg leading-relaxed max-w-md italic">
                {product.description}
              </p>
            </div>

            {/* GRID DE INFO */}
            <div className={`py-8 lg:py-10 border-y border-planthia-dark/10 ${product.type === 'plantas'
              ? 'grid grid-cols-2 gap-y-8 lg:gap-y-10 gap-x-4 lg:gap-x-8'
              : 'grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8'
              }`}>
              {product.type === 'plantas' ? (
                <>
                  <CareItem icon={Sun} label="Luz" value={product.metadata?.light || "No especificado"} />
                  <CareItem icon={Droplets} label="Riego" value={product.metadata?.water || "No especificado"} />
                  <CareItem icon={ArrowUp} label="Crecimiento" value={product.metadata?.growth || "No especificado"} />
                  <CareItem icon={Thermometer} label="Humedad" value={product.metadata?.humidity || "No especificado"} />
                </>
              ) : (
                <>
                  <CareItem icon={Ruler} label="Dimensiones" value={product.metadata?.dimensions || "No especificado"} />
                  <CareItem icon={Package} label="Material" value={product.metadata?.material || "No especificado"} />
                  <CareItem icon={HandHeart} label="Tips de cuidado" value={product.metadata?.care_tips || "No especificado"} />
                </>
              )}
            </div>

            {product.variants && (
              <div className="hidden lg:flex">
                <VariantSelector />
              </div>
            )}

            {/* PRECIO + BOTÓN AGREGAR + FAVORITOS - SIEMPRE EN LÍNEA */}
            <div className="flex items-center gap-4 sm:gap-6 pt-4 lg:pt-6">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-planthia-dark flex-shrink-0">
                ${product.price.toLocaleString('es-AR')}
              </span>

              {/* BOTÓN AGREGAR */}
              <div className={`flex-1 flex items-center overflow-hidden transition-all duration-300 min-h-[48px] sm:min-h-[56px] lg:min-h-[60px] ${isOutOfStock
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-planthia-green hover:bg-planthia-dark text-planthia-cream"
                }`}>
                {quantityInCart > 0 ? (
                  <div className="flex w-full items-center px-2 sm:px-4">
                    <button
                      onClick={() => {
                        if (quantityInCart > 1) {
                          updateQuantity(currentUniqueId, quantityInCart - 1);
                          toast.info(`${product.name} actualizada`);
                        } else {
                          removeItem(currentUniqueId);
                          toast.error(`${product.name} eliminada`);
                        }
                      }}
                      className="p-3 sm:p-4 hover:scale-110 transition-transform cursor-pointer font-bold text-lg sm:text-xl"
                    >
                      -
                    </button>

                    <div className="flex-1 flex flex-col items-center justify-center">
                      <span className="xl:hidden text-base sm:text-lg font-bold">
                        {quantityInCart}
                      </span>
                      <span className="hidden xl:block text-[10px] font-bold tracking-[0.2em] whitespace-nowrap">
                        {quantityInCart} EN EL CARRITO
                      </span>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={quantityInCart >= stockDisponible}
                      className="p-3 sm:p-4 hover:scale-110 transition-transform cursor-pointer font-bold text-lg sm:text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 cursor-pointer uppercase text-[10px] tracking-[0.2em] font-bold transition-all"
                  >
                    {isOutOfStock ? "Sin Stock" : "Agregar"}
                  </button>
                )}
              </div>

              {/* BOTÓN FAVORITOS */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="p-2 sm:p-3 lg:p-4 rounded-full cursor-pointer border border-planthia-dark/10 hover:bg-planthia-green hover:text-planthia-cream transition-all group flex-shrink-0">
                <Heart size={18} strokeWidth={1.5} className="group-hover:fill-current sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN: PODRÍA INTERESARTE */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 lg:mt-32 pb-20 border-t border-planthia-dark/5 pt-16 lg:pt-20">
            <h2 className="text-2xl lg:text-3xl font-manrope text-planthia-dark mb-8 lg:mb-12">Podría interesarte</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((relatedP) => (
                <ProductCardShop key={relatedP.id} product={relatedP} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
