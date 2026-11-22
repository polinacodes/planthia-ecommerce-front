// src/app/guia/page.tsx
// Página del servidor: trae las plantas y se las pasa ya listas a la guía (que sigue siendo del cliente).
import { Suspense } from 'react';
import { getShopProducts } from '@/lib/shop';
import GuideContent from './GuideContent';

export default async function GuidePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Leer la búsqueda y el filtro de la URL hace que la página se arme con los resultados reales
  await searchParams;
  const products = await getShopProducts();

  return (
    <Suspense fallback={null}>
      <GuideContent initialPlants={products} />
    </Suspense>
  );
}
