import { productPath } from '@/lib/products';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { Heart, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useCart, isCartItemOfProduct } from '@/hooks/useCart';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  documentId?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  difficulty: string;
  stock?: number;
  variants?: any[];
}

interface ProductCardShopProps {
  product: Product;
  /** En el shop las tarjetas van debajo del h1, así que usan h2 (en otras secciones, h3) */
  headingAs?: 'h2' | 'h3';
  /** Primeras fotos de la página: se descargan antes (mejora el LCP) */
  priority?: boolean;
}

const ProductCardShop = ({ product, headingAs: Heading = 'h3', priority = false }: ProductCardShopProps) => {
  const { addItem, cart, openCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();

  const hasVariants = product.variants && product.variants.length > 0;

  const favoriteActive = useMemo(() => {
    return isFavorite(product.documentId || '');
  }, [product.documentId, isFavorite]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    await toggleFavorite(product.documentId || '', product.name);
  };

  const quantityInCart = cart
    .filter((item: any) => isCartItemOfProduct(item, product))
    .reduce((acc: number, item: any) => acc + item.quantity, 0);

  const isAlreadyInCart = quantityInCart > 0;
  const isLimitReached = quantityInCart >= 10;
  const isOutOfStock = !hasVariants && (product.stock === undefined || product.stock <= 0);


  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVariants) {
      router.push(productPath(product));
    } else {
      const wasAdded = addItem({
        id: product.id,
        documentId: product.documentId,
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
        <Link href={productPath(product)} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            preload={priority}
            fetchPriority={priority ? "high" : undefined}
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
          aria-label={`${favoriteActive ? "Quitar de favoritos" : "Agregar a favoritos"}: ${product.name}`}
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
          href={productPath(product)}
          aria-label={`Ver ${product.name}`}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex z-10"
        >
          <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full text-[#4F7A2E] hover:bg-planthia-green hover:text-white transition-colors">
            <Eye size={20} />
          </div>
        </Link>
      </div>

      {/* Info del Producto */}
      <div className="p-4 flex flex-col flex-grow">
        <Heading className="text-lg font-bold text-gray-800 leading-tight mb-1">
          {product.name}
        </Heading>
        <p className="text-gray-500 text-xs line-clamp-1 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Precio y Acción */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="text-lg min-[400px]:text-xl font-extrabold text-[#4F7A2E]">
            ${product.price.toLocaleString('es-AR')}
          </span>

          <button
            onClick={handleAction}
            disabled={isOutOfStock}
            aria-label={
              isOutOfStock
                ? `${product.name}: sin stock`
                : hasVariants
                  ? `Elegir opciones de ${product.name}`
                  : isAlreadyInCart
                    ? `Agregar otra unidad de ${product.name} (${quantityInCart} en el carrito)`
                    : `Agregar ${product.name} al carrito`
            }
            className={`text-white font-headline font-bold w-[34px] h-[34px] sm:w-10 sm:h-10 flex-shrink-0 md:w-auto md:h-auto md:px-4 md:py-2 rounded-full transition-colors flex items-center justify-center gap-2
              ${isOutOfStock 
                ? "bg-gray-400 cursor-not-allowed" 
                : isAlreadyInCart 
                  ? "bg-planthia-light-green hover:bg-planthia-green-dark" 
                  : "bg-planthia-green hover:bg-planthia-green-dark"
              }`}
          >
            {/* VISTA MOBILE */}
            <div className="md:hidden flex items-center justify-center font-bold">
              {isAlreadyInCart ? <span className="text-sm">{quantityInCart}</span> : <Plus size={18} />}
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