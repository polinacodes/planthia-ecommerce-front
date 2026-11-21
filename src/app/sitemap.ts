// src/app/sitemap.ts → /sitemap.xml
// Lista todas las páginas públicas para Google: secciones, productos, fichas de la guía y artículos.
import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/blog';
import { slugify } from '@/lib/guide';
import { productPath } from '@/lib/products';
import { SITE_URL, getSeoProducts } from '@/lib/seo';
import { isGuidePlant } from '@/lib/guide';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getSeoProducts(), getArticles()]);
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/guia`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}${productPath(p)}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = products.filter(isGuidePlant).map((p) => ({
    url: `${SITE_URL}/guia/${slugify(p.name)}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...productPages, ...guidePages, ...articlePages];
}
