'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePlants } from '@/hooks/usePlants';
import ProductCardShop from '@/components/products/ProductCardShop';

interface RecommendedProductsProps {
  orders: any[];
}

export default function RecommendedProducts({ orders }: RecommendedProductsProps) {
  const [productsToShow, setProductsToShow] = useState(4);
  const { plants, loading: plantsLoading } = usePlants();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setProductsToShow(4);
      else if (width < 1280) setProductsToShow(3);
      else setProductsToShow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders]);

  const recommendedProducts = useMemo(() => {
    if (!plants || plants.length === 0) return [];
    if (!orders || orders.length === 0) return plants.slice(0, 4);

    try {
      const latestOrder = sortedOrders[0];
      if (!latestOrder) return plants.slice(0, 4);

      const itemsArray = Array.isArray(latestOrder.items) ? latestOrder.items : [];
      if (itemsArray.length === 0) return plants.slice(0, 4);

      const lastPurchasedId = (itemsArray[0].productId || itemsArray[0].id || '').toString().split('-')[0];
      const lastPurchasedPlant = plants.find(p => p.id.toString() === lastPurchasedId);

      if (!lastPurchasedPlant || !lastPurchasedPlant.subcategory) {
        return plants.slice(0, 4);
      }

      const currentSub = lastPurchasedPlant.subcategory.name;

      const filtered = plants.filter(
        p => p.subcategory?.name === currentSub && p.id.toString() !== lastPurchasedId
      );

      if (filtered.length < 4) {
        const extra = plants.filter(p => p.id.toString() !== lastPurchasedId && p.subcategory?.name !== currentSub);
        return [...filtered, ...extra].slice(0, 4);
      }

      return filtered.slice(0, 4);
    } catch (error) {
      console.error("Error calculando recomendados:", error);
      return plants.slice(0, 4);
    }
  }, [sortedOrders, orders, plants]);

  if (plantsLoading || recommendedProducts.length === 0) return null;

  return (
    <section className="mt-20 lg:mt-32 pb-16 border-t border-planthia-dark/5 pt-16 lg:pt-16">
      <h2 className="font-headline text-2xl text-planthia-dark mb-8 lg:mb-12">
        {orders && orders.length > 0
          ? "Basado en tu última compra"
          : "Recomendados para tu jardín"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {recommendedProducts.slice(0, productsToShow).map((item: any) => (
          <ProductCardShop key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}