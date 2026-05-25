import React, { useMemo } from 'react';
import Image from 'next/image';
import { Heart, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  difficulty: string;
  stock?: number;
  variants?: any[];
}

const ProductCardShop = ({ product }: { product: Product }) => {
  const { addItem, cart, openCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();

  const hasVariants = product.variants && product.variants.length > 0;

  const favoriteActive = useMemo(() => {
    return isFavorite(Number(product.id));
  }, [product.id, isFavorite]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    await toggleFavorite(Number(product.id));
  };

  const quantityInCart = cart
    .filter((item: any) => String(item.id).startsWith(String(product.id)))
    .reduce((acc: number, item: any) => acc + item.quantity, 0);

  const isAlreadyInCart = quantityInCart > 0;
  const isLimitReached = quantityInCart >= 10;
  const isOutOfStock = !hasVariants && (product.stock === undefined || product.stock <= 0);


  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVariants) {
      router.push(`/shop/${product.id}`);
    } else {
      const wasAdded = addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        stock: product.stock || 0 
      });

      if (wasAdded) {
        toast.success(`${product.name} agregada`);
        openCart();
      }
    }
  };


  return (
    <div className="group relative bg-[#FFFFFF] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">

      {/* Contenedor de Imagen */}
      <div className="relative aspect-square w-full bg-[#f9f9f9] overflow-hidden group">
        <Link href={`/shop/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badge de Dificultad */}
        {/* <div className="absolute top-3 left-3">
          <span className="bg-white/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold text-gray-700">
            {product.metadata?.difficulty}
          </span>
        </div> */}

        {/* Favorito  */}
        <button 
          onClick={handleFavorite}
          title={favoriteActive ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute top-3 right-3 p-2 bg-transparent hover:bg-transparent backdrop-blur-md rounded-full transition-all text-planthia-green hover:text-planthia-green cursor-pointer z-20"
        >
          <Heart 
            size={18} 
            strokeWidth={1.5}
            className={`transition-colors duration-300 sm:w-6 sm:h-6
              ${favoriteActive 
                ? 'text-planthia-green fill-planthia-green' 
                : 'hover:fill-current'
              }`}
          />
        </button>

        <Link
          href={`/shop/${product.id}`}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex z-10"
        >
          <div className="bg-[#5B823B]/20 backdrop-blur-sm p-2 rounded-lg text-[#5B823B] hover:bg-planthia-light-green hover:text-white transition-colors">
            <Eye size={20} />
          </div>
        </Link>
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

          <button
            onClick={handleAction}
            disabled={isOutOfStock}
            className={`text-white p-2 md:px-4 md:py-2 rounded-lg transition-all flex items-center justify-center gap-2 min-w-[40px]
              ${isOutOfStock 
                ? "bg-gray-400 cursor-not-allowed" 
                : isAlreadyInCart 
                  ? "bg-planthia-light-green hover:bg-planthia-green" 
                  : "bg-planthia-green hover:bg-planthia-light-green"
              }`}
          >
            {/* VISTA MOBILE */}
            <div className="md:hidden flex items-center justify-center font-bold">
              {isAlreadyInCart ? <span className="text-sm">{quantityInCart}</span> : <Plus size={20} />}
            </div>

            {/* VISTA DESKTOP */}
            <span className="hidden md:block text-sm font-semibold cursor-pointer">
              {isOutOfStock ? "Sin stock" :isAlreadyInCart ? "Agregado" : "Agregar"}
            </span>
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ProductCardShop;