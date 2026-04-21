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
import { toast } from 'sonner';

// --- SUB-COMPONENTES AUXILIARES ---
const CareItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex gap-4 items-start">
    <Icon size={20} strokeWidth={1.5} className="text-planthia-dark/50" />
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-planthia-dark/50 mb-1">{label}</span>
      <span className="text-xs font-bold text-planthia-dark/80 uppercase">{value}</span>
    </div>
  </div>
);

export default function ProductPage() {
  const params = useParams();
  const id = params.id;
  const { plants, loading } = usePlants();
  const { addItem, cart, removeItem, updateQuantity } = useCart();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const product = useMemo(() => {
    if (!plants) return undefined;
    return plants.find((p) => p.id.toString() === id?.toString());
  }, [plants, id]);

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

  const getHexColor = (color: string) => {
    const colors: { [key: string]: string } = {
      rojo: "#e11d48", rosa: "#fb7185", "rosa intenso": "#be123c",
      "rosa palido": "#fda4af", violeta: "#7c3aed", magenta: "#d946ef",
      blanco: "#ffffff", naranja: "#f97316", amarillo: "#facc15",
      salmon: "#fa8072", burdeus: "#800020", beige: "#D4C1A9",
    "rosa pastel": "#DBB5B1","verde pastel": "#90A67F", floral:"#D36658",
    };
    return colors[color.toLowerCase()] || "#cbd5e1";
  };

  const relatedProducts = useMemo(() => {
    if (!product || !plants) return [];
    const currentSub = product.subcategory?.name;
    return plants
      .filter(p => p.subcategory?.name === currentSub && p.id !== product.id)
      .slice(0, 4);
  }, [product, plants]);

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
    if (!product?.variants || product.variants.length === 0) return null;
    return (
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          {product.variants.map((variant: any) => (
            <button
              key={variant.color}
              onClick={() => {
                setSelectedImage(variant.image);
                setSelectedVariant(variant);
              }}
              className={`w-5 h-5 rounded-full border shadow-md transition-all duration-300 ${selectedImage === variant.image
                ? 'scale-125 border-planthia-dark/30 '
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

    addItem({
      id: uniqueId,
      name: product.name,
      color: selectedVariant?.color,
      price: product.price,
      image: selectedImage || product.image,
      quantity: 1
    });

    toast.success(`${product.name} agregada`, {
      description: selectedVariant
        ? `Color: ${selectedVariant.color}. Ya podés verla en tu carrito.`
        : "Ya podés verla en tu carrito.",
    });
  };

  return (
    <main className="min-h-screen bg-planthia-cream pt-6 md:pt-12">
      <div className="max-w-7xl mx-auto px-8">
        {/* 1. BREADCRUMBS */}
        <nav className="text-[10px] uppercase tracking-[0.2em] text-planthia-dark/60 mb-4">
          <Link
            href={`/tienda?type=${product.type}`}
            className="hover:text-planthia-green transition-colors"
          >
            {product.type === 'plantas' ? 'Plantas' : 'Cuidados'}
          </Link>
          <span className="mx-2 text-planthia-dark/30">/</span>
          <Link
            href={`/tienda?type=${product.type}&category=${product.subcategory?.name?.toLowerCase() || 'todas'}`}
            className="hover:text-planthia-green transition-colors"
          >
            {product.subcategory?.name || 'Sin categoría'}
          </Link>
          <span className="mx-2 text-planthia-dark/30">/</span>
          <span className="text-planthia-dark font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 min-h-[600px] items-start">
          {/*COLUMNA IZQUIERDA: VISUALS */}
          <div className="flex flex-col p-2">
            <div className="relative w-full h-[400px] md:h-[650px] bg-planthia-cream rounded-[3rem] overflow-hidden">
              {product.petFriendly && (
                <div className="absolute top-8  z-10 bg-planthia-light-green/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                  <PawPrint size={14} className="text-planthia-dark" />
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
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-2 transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-planthia-cream/50 animate-pulse rounded-[3rem]" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="md:hidden flex justify-center py-2">
              <VariantSelector />
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO y COMPRA */}
          <div className="flex flex-col -mt-8 md:mt-16 justify-center space-y-8 lg:pl-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-manrope text-planthia-dark leading-tight">
                {product.name}
              </h1>
              <p className="text-planthia-dark/60 text-lg leading-relaxed max-w-md italic">
                {product.description}
              </p>
            </div>

            {/* GRID DE INFO */}
            <div className={`py-10 border-y border-planthia-dark/10 ${product.type === 'plantas'
              ? 'grid grid-cols-2 gap-y-10 gap-x-8'
              : 'grid grid-cols-1 md:grid-cols-3 gap-8'
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
              <div className="hidden md:flex">
                <VariantSelector />
              </div>
            )}

            <div className="flex items-center gap-6 pt-6">
              <span className="text-4xl font-light text-planthia-dark">
                ${product.price.toLocaleString('es-AR')}
              </span>
              {/* BOTÓN ÚNICO CON LÓGICA DUAL */}
              <div className="flex-1 flex items-center bg-planthia-green text-planthia-cream transition-all duration-300 min-h-[60px]">
                {quantityInCart > 0 ? (
                  <div className="flex w-full items-center justify-between px-2 sm:px-4">
                    <button
                      onClick={() => {
                        if (quantityInCart > 1) {
                          updateQuantity(currentUniqueId, quantityInCart - 1);
                          toast.info(`${product.name}: actualizada`);
                        } else {
                          removeItem(currentUniqueId);
                          toast.error(`${product.name}: eliminada`);
                        }
                      }}
                      className="p-4 hover:scale-110 transition-transform font-bold text-xl"
                    >
                      -
                    </button>

                    {/* CONTENIDO CENTRAL */}
                    <div className="flex flex-col items-center">
                      <span className="md:hidden text-lg font-bold">
                        {quantityInCart}
                      </span>

                      <span className="hidden md:block text-[10px] font-bold tracking-[0.2em]">
                        {quantityInCart} EN EL CARRITO
                      </span>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="p-4 hover:scale-110 transition-transform font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-5 px-8 uppercase text-[10px] tracking-[0.2em] font-bold hover:bg-planthia-light-green transition-all"
                  >
                    Agregar
                  </button>
                )}
              </div>

              <button className="p-4 rounded-full border border-planthia-dark/10 hover:bg-planthia-green hover:text-planthia-cream transition-all group">
                <Heart size={20} strokeWidth={1.5} className="group-hover:fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN: PODRÍA INTERESARTE */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 pb-20 border-t border-planthia-dark/5 pt-20">
            <h2 className="text-3xl font-manrope text-planthia-dark mb-12">Podría interesarte</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((relatedP, index) => (
                <div
                  key={relatedP.id}
                  className={`
                   ${index === 2 ? "hidden md:block" : "block"} 
                   ${index === 3 ? "hidden lg:block" : "block"}
                 `}
                >
                  <ProductCardShop product={relatedP} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}




