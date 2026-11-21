// src/app/robots.ts → /robots.txt
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Páginas privadas o de paso: no tienen sentido en Google
      disallow: ['/account', '/checkout', '/payment-status', '/wishlist', '/login', '/register', '/set-password', '/forgot-password', '/newsletter'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
