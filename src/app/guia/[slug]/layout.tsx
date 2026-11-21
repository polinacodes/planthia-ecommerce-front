// src/app/guia/[slug]/layout.tsx
// Título, descripción e imagen para compartir de cada ficha de la guía de cuidados.
import type { Metadata } from 'next';
import { slugify } from '@/lib/guide';
import { getSeoGuidePlants, metaDescription } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { slug } = await params;
  const plant = (await getSeoGuidePlants()).find((p) => slugify(p.name) === slug);
  if (!plant) return { title: 'Ficha no encontrada | Planthia' };

  const title = `Cómo cuidar ${plant.name} | Planthia`;
  const description =
    metaDescription(
      `Guía de cuidados de ${plant.name}: luz, riego, sustrato, temperatura y consejos para que crezca sana. ${plant.description ?? ''}`,
    );

  return {
    title,
    description,
    alternates: { canonical: `/guia/${slug}` },
    openGraph: {
      title,
      description,
      url: `/guia/${slug}`,
      images: plant.image ? [{ url: plant.image, alt: plant.name }] : undefined,
    },
  };
}

export default function GuideDetailLayout({ children }: Props) {
  return children;
}
