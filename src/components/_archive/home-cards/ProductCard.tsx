// ARCHIVADO (no se usa): tarjeta horizontal de la home que se pone verde y se agranda al tocarla.
// La usa RecommendedSectionHorizontal.tsx, en esta misma carpeta.
"use client";

import { productPath } from '@/lib/products';
import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart, isCartItemOfProduct } from '@/hooks/useCart';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'sonner';

// Resorte suave para el movimiento de la imagen
const SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;

// Breakpoint actual (para elegir cuánto se agranda la imagen)
function useBreakpoint() {
  const [bp, setBp] = useState<'base' | 'sm' | 'lg'>('base');
  useEffect(() => {
    const sm = window.matchMedia('(min-width: 640px)');
    const lg = window.matchMedia('(min-width: 1024px)');
    const update = () => setBp(lg.matches ? 'lg' : sm.matches ? 'sm' : 'base');
    update();
    sm.addEventListener('change', update);
    lg.addEventListener('change', update);
    return () => {
      sm.removeEventListener('change', update);
      lg.removeEventListener('change', update);
    };
  }, []);
  return bp;
}

// Escala de la imagen según estado y pantalla (mismo tamaño visual que antes)
const IMAGE_SCALE = {
  active: { base: 1.3, sm: 1.34, lg: 1.94 },
  inactive: { base: 0.9, sm: 1, lg: 1 },
} as const;

interface ProductCardProps {
  plant: any;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const ProductCard = ({ plant, isActive, onClick }: ProductCardProps) => {
  const { addItem, openCart, cart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const bp = useBreakpoint();
  const imageScale = IMAGE_SCALE[isActive ? 'active' : 'inactive'][bp];

  const favoriteActive = useMemo(() => {
    return isFavorite(plant.documentId);
  }, [plant.documentId, isFavorite]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(plant.documentId, plant.name);
  };

  const cartItem = cart.find((item: any) => isCartItemOfProduct(item, plant));
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isLimitReached = quantityInCart >= 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Primer color con stock (antes tomaba siempre el primero, aunque estuviera agotado)
    const variants = plant.variants ?? [];
    const selectedVariant = variants.find((v: any) => (v.stock ?? 0) > 0) ?? variants[0] ?? null;
    const uniqueId = selectedVariant ? `${plant.id}-${selectedVariant.color.toLowerCase()}` : plant.id;
    const stockValue = selectedVariant ? selectedVariant.stock : (plant.stock || 0);

    const wasAdded = addItem({
      id: uniqueId,
      documentId: plant.documentId,
      name: plant.name,
      color: selectedVariant?.color,
      price: plant.price,
      image: selectedVariant?.image || plant.image,
      quantity: 1,
      stock: stockValue
    });

    if (wasAdded) {
      toast.success(`${plant.name} agregada`);
    }
  };

  // Curva de animación compartida: arranca rápido y frena suave
  const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-3xl p-4 sm:p-5 lg:p-6 group flex items-center
        transition-[background-color,color,box-shadow,height,min-height,scale,translate] duration-500 ${EASE}
        ${isActive
        ? 'bg-[#4F7A2E] text-white lg:scale-105 z-20 shadow-lg sm:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] lg:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] min-h-[180px] sm:min-h-[200px] lg:h-[240px]'
        : 'bg-white text-gray-800 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] min-h-[160px] sm:min-h-[180px] lg:h-[220px] z-10 overflow-hidden'
        }`}
    >
      {/* Icono Favorito */}
      <motion.button
        onClick={handleFavorite}
        title={favoriteActive ? "Quitar de favoritos" : "Agregar a favoritos"}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 cursor-pointer ${favoriteActive
              ? isActive
                ? 'text-planthia-ice fill-current drop-shadow-sm'
                : 'text-planthia-green fill-current drop-shadow-sm'
              : isActive
                ? 'text-white/70 hover:text-white'
                : 'text-gray-300 hover:text-planthia-green'
            }`}
        />
      </motion.button>

      {/* Contenedor principal */}
      <div className="flex items-center gap-3 sm:gap-4 h-full relative w-full">
        {/* Imagen: siempre del mismo tamaño; al activarse solo cambia de lugar (layout="position")
            y se agranda con scale, así framer no tiene que deformarla y la animación es fluida */}
        <motion.div
          layout="position"
          initial={false}
          animate={{ scale: imageScale }}
          transition={SPRING}
          className={`z-20 flex-shrink-0 flex justify-center ${isActive
            ? 'mx-2.5 lg:mx-0 lg:absolute lg:-top-[22px] lg:-left-[38px]'
            : 'relative -translate-x-2 sm:-translate-x-4 -mr-3 sm:-mr-5 lg:-mr-6'
            }`}
        >
          <Image
            src={plant.image}
            alt={plant.name}
            // Se pide una versión grande (Next sirve 384 px o 640 px en pantallas retina)
            // porque al activarse la imagen se agranda hasta ~2x con scale.
            // El tamaño en pantalla lo fijan las clases w-[...]
            width={300}
            height={300}
            quality={90}
            className="object-contain w-[110px] h-auto sm:w-[120px] lg:w-[140px]"
            priority={isActive}
          />
        </motion.div>

        {/* Lado Derecho: Información */}
        {/* layout="position": el texto se desliza junto con la imagen en vez de saltar */}
        <motion.div layout="position" transition={SPRING} className={`flex-1 min-w-0 z-10 ${isActive ? 'lg:ml-36' : ''
          }`}>
          <h3 className={`font-extrabold leading-tight transition-[font-size] duration-500 ${EASE} ${isActive
            ? 'text-base sm:text-lg lg:text-xl'
            : 'text-sm sm:text-base lg:text-lg'
            }`}>
            {plant.name}
          </h3>

          {/* Descripción: siempre visible, máximo 2 líneas con "…" */}
          <p className={`mt-1 text-[11px] sm:text-xs leading-relaxed line-clamp-2 transition-colors duration-500 ${EASE} ${isActive ? 'text-white' : 'text-gray-500'
            }`}>
            {plant.description}
          </p>

          {/* Precio */}
          <span className={`font-bold block my-1 sm:my-2 transition-[color,font-size] duration-500 ${EASE} ${isActive ? 'text-white' : 'text-[#4F7A2E]'
            } ${isActive ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg lg:text-xl'}`}>
            ${plant.price}
          </span>

          {/* Botones: se despliegan animando grid-template-rows (0fr → 1fr), que es suave y no necesita medir alturas */}
          <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${EASE} ${isActive
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
            }`}>
            <div className="overflow-hidden -m-1 p-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={isLimitReached}
                  tabIndex={isActive ? 0 : -1}
                  className={`flex-1 min-w-0 whitespace-nowrap px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-full font-headline text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer
                      ${isLimitReached
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-[#4F7A2E] hover:bg-gray-100"}`}
                >
                  {isLimitReached ? 'Máximo alcanzado' : (cartItem ? 'Agregado' : 'Agregar')}
                </motion.button>
                <Link
                  href={productPath(plant)}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`Ver ${plant.name}`}
                  className="flex-shrink-0 p-2 sm:p-2.5 lg:p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductCard;