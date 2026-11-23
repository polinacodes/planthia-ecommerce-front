// src/lib/shop.ts
// Pedido de productos compartido entre el servidor (shop) y el hook usePlants.
// pageSize 100: Strapi devuelve 25 por defecto y, si el catálogo crece, el resto no aparecería.
export const PRODUCTS_QUERY =
  'populate=subcategory&populate=metadata&populate=variants&pagination[pageSize]=100';

// Se usa en el servidor. Queda en caché 1 minuto: los cambios de Strapi (precios, stock, textos) tardan hasta 1 minuto en verse.
// Si Strapi falla devuelve null y el shop los pide desde el navegador, como antes.
export async function getShopProducts(): Promise<any[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?${PRODUCTS_QUERY}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : null;
  } catch {
    return null;
  }
}
