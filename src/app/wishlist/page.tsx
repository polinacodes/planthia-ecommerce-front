"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/hooks/useCart';
import { usePlants } from '@/hooks/usePlants';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '@/components/products/EmptyState';

export default function WishlistPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { plants, loading } = usePlants();
  const { addItem, openCart } = useCart();

  const favoriteProducts = React.useMemo(() => {
    if (!plants || !favorites) return [];

    const favoriteIds = new Set(favorites.map(fav => Number(fav.productId)));

    return plants.filter((plant) => favoriteIds.has(Number(plant.id)));
  }, [plants, favorites]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();

    const targetProduct = product.attributes || product;
    const stockDisponible = targetProduct.stock !== undefined ? targetProduct.stock : (product.stock || 0);
    const isOutOfStock = stockDisponible <= 0;

    if (isOutOfStock) {
      toast.error("Lo sentimos, este producto no tiene stock disponible");
      return;
    }

    const wasAdded = addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: stockDisponible 
    });

    if (wasAdded) {
      toast.success(`${product.name} agregada al carrito`);
      openCart();
    }
  };

  const handleRemoveFavorite = async (id: any, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    await toggleFavorite(Number(id), name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-planthia-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-planthia-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <main className="min-h-screen bg-planthia-cream pt-12">
        <EmptyState
          title="Tu lista de deseos está vacía"
          description={
            <div className="space-y-4">
              <p>¿Aún no te enamoraste de ninguna planta? Explora nuestro catálogo.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-bold text-planthia-green hover:text-planthia-dark transition-colors uppercase tracking-wider"
              >
                <ArrowLeft size={16} /> Volver a la tienda
              </Link>
            </div>
          }
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-planthia-cream pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="border-b border-planthia-dark/10 pb-6 mb-8">
          <h1 className="text-2xl sm:text-2xl font-manrope text-planthia-dark mb-0">
            Mi Lista de Favoritos
          </h1>
          {/* <p className="text-sm text-planthia-dark/60 ">
            Tienes {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}
          </p> */}
        </div>

        {/* Tabla / Lista de Favoritos */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-planthia-dark/5">
          <div className="divide-y divide-planthia-dark/10">
            {favoriteProducts.map((product) => {
              const targetProduct = product.attributes || product;
              const stockDisponible = targetProduct.stock !== undefined ? targetProduct.stock : (product.stock || 0);
              const isOutOfStock = stockDisponible <= 0;

              return (
                <div
                  key={product.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover:bg-planthia-cream/20 transition-colors"
                >
                  {/* Imagen */}
                  <Link href={`/shop/${product.id}`} className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#f9f9f9] rounded-xl overflow-hidden flex-shrink-0 group">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Info Detallada */}
                  <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
                    <Link href={`/shop/${product.id}`} className="inline-block">
                      <h3 className="text-lg font-bold text-gray-800 hover:text-planthia-green transition-colors truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-xs line-clamp-2 max-w-md">
                      {product.description}
                    </p>
                    {product.metadata?.difficulty && (
                      <span className="inline-block bg-planthia-cream text-planthia-dark/70 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md mt-1">
                        Dificultad: {product.metadata.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="text-center sm:text-right flex-shrink-0">
                    <span className="text-xl font-extrabold text-[#5B823B] block">
                      ${product.price.toLocaleString('es-AR')}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mt-0.5 ${isOutOfStock ? 'text-rose-500' : 'text-planthia-light-green'}`}>
                      {isOutOfStock ? 'Sin Stock' : 'Disponible'}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0">
                    {/* Botón Dinámico: Agregar al Carrito o Ver Opciones */}
                    {product.variants && product.variants.length > 0 ? (
          
                      <Link
                        href={`/shop/${product.id}`}
                        className="flex-1 sm:w-40 justify-center text-center bg-planthia-green hover:bg-planthia-dark text-white px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                      >
                        <ShoppingCart size={14} />
                        <span>Ver opciones</span>
                      </Link>
                    ) : (
                  
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={isOutOfStock}
                        className={`flex-1 sm:w-40 justify-center text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider
                            ${isOutOfStock
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-planthia-green hover:bg-planthia-dark"
                          }`}
                      >
                        <ShoppingCart size={14} />
                        <span>Agregar</span>
                      </button>
                    )}

                    {/* Botón Eliminar de Favoritos */}
                    <button
                      onClick={(e) => handleRemoveFavorite(product.id, product.name, e)}
                      className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                      title="Eliminar de la lista"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}