// src/app/shop/[slug]/layout.tsx
// Título, descripción e imagen para compartir de cada ficha de producto.
import type { Metadata } from 'next';
import { findProductByParam, productPath } from '@/lib/products';
import { getSeoProducts, metaDescription } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductByParam(await getSeoProducts(), slug);
  if (!product) return { title: 'Producto no encontrado | Planthia' };

  const description =
    metaDescription(product.description) ??
    `Comprá ${product.name} en Planthia, con envíos a todo el país.`;

  return {
    title: `${product.name} | Planthia`,
    description,
    alternates: { canonical: productPath(product) },
    openGraph: {
      title: `${product.name} | Planthia`,
      description,
      url: productPath(product),
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  };
}

export default function ProductLayout({ children }: Props) {
  return children;
}
