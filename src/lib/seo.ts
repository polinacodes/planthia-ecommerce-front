// src/lib/seo.ts
// Datos para SEO (títulos, descripciones, sitemap). Se usan desde el servidor.
import { isGuidePlant } from '@/lib/guide';

// Dirección pública del sitio (para links absolutos, el sitemap y las vistas previas al compartir).
// Si algún día usás un dominio propio, cargalo en NEXT_PUBLIC_SITE_URL en Vercel.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://planthia.vercel.app').replace(/\/$/, '');

export const SITE_NAME = 'Planthia';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// Los productos se vuelven a pedir como máximo una vez por hora para el SEO
export async function getSeoProducts(): Promise<any[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/products?populate=metadata&pagination[pageSize]=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getSeoGuidePlants() {
  return (await getSeoProducts()).filter(isGuidePlant);
}

/** Recorta un texto para la descripción de Google (≈155 caracteres) */
export function metaDescription(text?: string | null, max = 155): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : clean;
}
