"use client";

import React from 'react';
import { Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  plant: any;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const ProductCard = ({ plant, isActive, onClick }: ProductCardProps) => {
  const { addItem, openCart, cart } = useCart();

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Future: Add to favorites logic for", plant.id);
  };
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const selectedVariant = plant.variants && plant.variants.length > 0 ? plant.variants[0] : null;
    const uniqueId = selectedVariant ? `${plant.id}-${selectedVariant.color.toLowerCase()}` : plant.id;

    addItem({
      id: uniqueId,
      name: plant.name,
      color: selectedVariant?.color,
      price: plant.price,
      image: selectedVariant?.image || plant.image,
      quantity: 1
    });

    toast.success(`${plant.name} agregada`);
  };

  const isAlreadyInCart = cart.some((item: any) => 
  String(item.id).startsWith(String(plant.id))
);

  return (
    <motion.div
      onClick={onClick}
      layout
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8
      }}
      className={`relative cursor-pointer rounded-3xl p-4 sm:p-5 lg:p-6 group flex items-center ${isActive
        ? 'bg-[#5B823B] text-white lg:scale-105 z-20 shadow-lg sm:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] lg:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] min-h-[180px] sm:min-h-[200px] lg:h-[240px]'
        : 'bg-white text-gray-800 shadow-sm border border-gray-100 hover:shadow-lg min-h-[160px] sm:min-h-[180px] lg:h-[220px] z-10'
        } ${!isActive && 'overflow-hidden'}`}
      whileHover={!isActive ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isActive ? { scale: 0.98 } : {}}
    >
      {/* Icono Favorito */}
      <motion.button
        onClick={handleFavorite}
        title="Próximamente: Agregar a favoritos"
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isActive ? 'text-white/70 hover:text-white' : 'text-gray-300 hover:text-[#588534]'
            }`}
        />
      </motion.button>

      {/* Contenedor principal */}
      <div className="flex items-center gap-3 sm:gap-4 h-full relative w-full">
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8
          }}
          className={`z-20 flex-shrink-0 flex justify-center ${isActive
            ? 'lg:absolute lg:-top-8 lg:-left-12 lg:scale-[1.7] scale-110 sm:scale-115'
            : 'relative scale-90 sm:scale-100 -translate-x-2 sm:-translate-x-4'
            }`}
        >
          <Image
            src={plant.image}
            alt={plant.name}
            width={isActive ? 130 : 110}
            height={isActive ? 130 : 110}
            className={`object-contain ${isActive ? 'sm:w-[140px] lg:w-[160px]' : 'sm:w-[120px] lg:w-[140px]'}`}
            priority={isActive}
          />
        </motion.div>

        {/* Lado Derecho: Información */}
        <div className={`flex-1 z-10 transition-all duration-300 ${isActive ? 'lg:ml-36' : ''
          }`}>
          <h3 className={`font-extrabold leading-tight ${isActive
            ? 'text-base sm:text-lg lg:text-xl'
            : 'text-sm sm:text-base lg:text-lg'
            }`}>
            {plant.name}
          </h3>

          {/* Descripción */}
          <motion.p
            initial={false}
            animate={{
              opacity: isActive ? 0.9 : 0,
              height: isActive ? 'auto' : 0,
              marginTop: isActive ? '0.25rem' : 0,
              marginBottom: isActive ? '0.5rem' : 0
            }}
            transition={{ duration: 0.25, delay: isActive ? 0.1 : 0 }}
            className={`text-[10px] sm:text-xs leading-relaxed line-clamp-2 ${!isActive && 'pointer-events-none'
              }`}
          >
            {plant.description}
          </motion.p>

          {/* Precio */}
          <span className={`font-bold block my-1 sm:my-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-[#5B823B]'
            } ${isActive ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg lg:text-xl'}`}>
            ${plant.price}
          </span>

          {/* Botones */}
          <motion.div
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              height: isActive ? 'auto' : 0
            }}
            transition={{ duration: 0.25, delay: isActive ? 0.15 : 0 }}
            className={`flex items-center gap-2 sm:gap-3 ${!isActive && 'pointer-events-none'
              }`}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="bg-white text-[#5B823B] px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm"
            >
              {isAlreadyInCart ? 'Agregado' : 'Agregar'}
            </motion.button>
            <Link
              href={`/tienda/${plant.id}`}
              className="p-2 sm:p-2.5 lg:p-3 bg-white/20 rounded-lg sm:rounded-xl hover:bg-white/30 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;