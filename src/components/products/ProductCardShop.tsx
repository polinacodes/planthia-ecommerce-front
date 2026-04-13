import React from 'react';
import Image from 'next/image';
import { Heart, Plus, Eye } from 'lucide-react'; // Asumiendo que usás lucide-react, sino avisame

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  difficulty: string;
}

const ProductCardShop = ({ product }: { product: Product }) => {
  return (
    <div className="group relative bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      
      {/* Contenedor de Imagen (Square) */}
<div className="relative aspect-square w-full bg-[#f9f9f9] overflow-hidden group">
  <Image
    src={product.image}
    alt={product.name}
    fill
    className="object-cover group-hover:scale-105 transition-transform duration-500"
  />
  
  {/* Badge de Dificultad (Top Left) */}
  <div className="absolute top-3 left-3">
    <span className="bg-white/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold text-gray-700">
      {product.difficulty}
    </span>
  </div>

  {/* Favorito (Top Right) - AHORA VERDE */}
  <button className="absolute top-3 right-3 p-2 bg-white/50 hover:bg-white backdrop-blur-md rounded-full transition-colors text-gray-600 hover:text-[#5B823B]">
    <Heart size={18} />
  </button>

  {/* Ícono de Ojo (Bottom Right) - SOLO DESKTOP HOVER */}
  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
    <div className="bg-[#5B823B]/20 backdrop-blur-sm p-2 rounded-lg text-[#5B823B]">
      <Eye size={20} /> {/* Asegurate de importar Eye de lucide-react */}
    </div>
  </div>
</div>

      {/* Info del Producto */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-1 mb-4 flex-grow">
          {product.description}
        </p>
        
        {/* Precio y Acción */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-extrabold text-[#5B823B]">
            ${product.price.toLocaleString('es-AR')}
          </span>
          
          {/* Botón: "+" en mobile, "Agregar" en desktop */}
          <button className="bg-[#5B823B] text-white p-2 md:px-4 md:py-2 rounded-lg hover:bg-[#4a6b30] transition-colors flex items-center gap-2">
            <Plus size={20} />
            <span className="hidden md:block text-sm font-semibold">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardShop;