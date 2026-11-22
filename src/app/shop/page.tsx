// src/app/shop/page.tsx
// Página del servidor: trae los productos y los pasa ya listos al shop (que sigue siendo del cliente).
import { Suspense } from 'react';
import { getShopProducts } from '@/lib/shop';
import ShopPageContent from './ShopPageContent';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Leer los filtros de la URL hace que la página se arme en cada visita con los filtros reales
  // (antes se armaba vacía y el footer quedaba arriba hasta que cargaba todo)
  await searchParams;
  const products = await getShopProducts();

  return (
    <Suspense fallback={null}>
      <ShopPageContent initialPlants={products} />
    </Suspense>
  );
}
