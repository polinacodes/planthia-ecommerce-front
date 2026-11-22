// src/app/guia/[slug]/page.tsx
// Página del servidor: trae las plantas y le pasa la ficha de cuidados ya lista al componente del cliente.
import { getShopProducts } from '@/lib/shop';
import GuideDetailContent from './GuideDetailContent';

export default async function GuideDetailPage() {
  const products = await getShopProducts();
  return <GuideDetailContent initialPlants={products} />;
}
