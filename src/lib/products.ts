// src/lib/products.ts
// URLs de las fichas de producto: /shop/monstera-deliciosa (a partir del nombre).
import { slugify } from '@/lib/guide';

export const productSlug = (product: { name?: string | null }) => slugify(product?.name ?? '');

export const productPath = (product: { name?: string | null }) => `/shop/${productSlug(product)}`;

/**
 * Busca el producto por su slug. También acepta el id numérico de las URLs viejas
 * (/shop/126), así los links que ya circulan siguen funcionando.
 */
export function findProductByParam<T extends { id: number | string; name?: string | null }>(
  products: T[],
  param: string | undefined,
): T | undefined {
  if (!param) return undefined;
  const value = decodeURIComponent(param).toLowerCase();
  return products.find((p) => productSlug(p) === value) ?? products.find((p) => String(p.id) === value);
}
