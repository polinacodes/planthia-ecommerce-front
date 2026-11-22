// src/app/shop/[slug]/page.tsx
// Página del servidor: trae los productos y le pasa la ficha ya lista al componente del cliente.
import { redirect } from 'next/navigation';
import { findProductByParam, productPath, productSlug } from '@/lib/products';
import { getShopProducts } from '@/lib/shop';
import ProductPageContent from './ProductPageContent';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getShopProducts();

  // URLs viejas con número (/shop/126) o nombres cambiados: redirige a la dirección actual
  const product = products ? findProductByParam(products, slug) : undefined;
  if (product && slug !== productSlug(product)) redirect(productPath(product));

  return <ProductPageContent initialPlants={products} />;
}
