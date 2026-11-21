// src/lib/blog.ts
// Datos y helpers del blog. Los artículos se cargan en Strapi (colección "Artículo").

export type BlogCategory = 'cuidados' | 'decoracion' | 'huerta';

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover?: { url: string; alternativeText?: string | null } | null;
  category: BlogCategory;
  reading_time?: number | null;
  content?: string | null;
  publishedAt: string;
  products?: any[];
}

export const BLOG_CATEGORIES: { id: BlogCategory; label: string }[] = [
  { id: 'cuidados', label: 'Cuidados' },
  { id: 'decoracion', label: 'Decoración' },
  { id: 'huerta', label: 'Huerta' },
];

export const categoryLabel = (id?: string | null) =>
  BLOG_CATEGORIES.find((c) => c.id === id)?.label ?? 'Blog';

export const isBlogCategory = (value?: string | null): value is BlogCategory =>
  BLOG_CATEGORIES.some((c) => c.id === value);

export const formatArticleDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' });

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// Los artículos se vuelven a pedir a Strapi cada 5 minutos como máximo:
// lo que publiques aparece solo, sin volver a hacer deploy.
const REVALIDATE_SECONDS = 300;

async function strapiFetch(path: string) {
  try {
    const res = await fetch(`${STRAPI_URL}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[blog] Error pidiendo artículos a Strapi:', error);
    return null;
  }
}

export async function getArticles(category?: BlogCategory): Promise<Article[]> {
  const params = new URLSearchParams({
    sort: 'publishedAt:desc',
    'pagination[pageSize]': '100',
  });
  ['title', 'slug', 'excerpt', 'category', 'reading_time', 'publishedAt'].forEach((field, i) =>
    params.set(`fields[${i}]`, field),
  );
  params.set('populate[cover][fields][0]', 'url');
  params.set('populate[cover][fields][1]', 'alternativeText');
  if (category) params.set('filters[category][$eq]', category);

  const json = await strapiFetch(`/api/articles?${params}`);
  return json?.data ?? [];
}

export async function getArticle(slug: string): Promise<Article | null> {
  const params = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate[products][populate][0]': 'variants',
    'populate[cover][fields][0]': 'url',
    'populate[cover][fields][1]': 'alternativeText',
  });
  const json = await strapiFetch(`/api/articles?${params}`);
  return json?.data?.[0] ?? null;
}
