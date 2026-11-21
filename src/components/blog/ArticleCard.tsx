// src/components/blog/ArticleCard.tsx
// Tarjetas del blog en estilo editorial: sin caja, la foto va directo sobre el fondo.
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Article, categoryLabel, formatArticleDate } from '@/lib/blog';

// Portada del artículo, o un fondo verde suave si todavía no tiene imagen
function Cover({ article, sizes, priority }: { article: Article; sizes: string; priority?: boolean }) {
  return article.cover ? (
    <Image
      src={article.cover.url}
      alt={article.cover.alternativeText || article.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  ) : (
    <div className="absolute inset-0 bg-[#e7eedf]" />
  );
}

// "CUIDADOS · 5 MIN"
function Kicker({ article }: { article: Article }) {
  return (
    <p className="font-headline font-bold text-[11px] uppercase tracking-[0.18em] text-planthia-green">
      {categoryLabel(article.category)}
      {article.reading_time ? ` · ${article.reading_time} min` : ''}
    </p>
  );
}

// Artículo destacado (el más reciente): foto grande a la izquierda, texto a la derecha
export function FeaturedArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group grid md:grid-cols-[1.35fr_1fr] gap-6 md:gap-10 lg:gap-14 items-center">
      <div className="relative aspect-[16/10] rounded-3xl overflow-hidden">
        <Cover article={article} sizes="(max-width: 768px) 100vw, 60vw" priority />
      </div>
      <div className="flex flex-col gap-4">
        <Kicker article={article} />
        <h2 className="font-headline font-extrabold text-3xl lg:text-4xl leading-[1.1] tracking-tight text-planthia-dark group-hover:text-planthia-green transition-colors">
          {article.title}
        </h2>
        {article.excerpt && <p className="text-planthia-dark/60 text-base lg:text-lg leading-relaxed">{article.excerpt}</p>}
        <p className="text-xs text-planthia-dark/50">{formatArticleDate(article.publishedAt)}</p>
        <span className="inline-flex items-center gap-2 font-headline font-bold text-xs uppercase tracking-[0.15em] text-planthia-green mt-1">
          Leer artículo <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group flex flex-col gap-4">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
        <Cover article={article} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
      </div>
      <div className="flex flex-col gap-2">
        <Kicker article={article} />
        <h3 className="font-headline font-extrabold text-xl leading-snug text-planthia-dark group-hover:text-planthia-green transition-colors">
          {article.title}
        </h3>
        {article.excerpt && <p className="text-sm text-planthia-dark/60 leading-relaxed line-clamp-2">{article.excerpt}</p>}
        <p className="text-xs text-planthia-dark/50 mt-1">{formatArticleDate(article.publishedAt)}</p>
      </div>
    </Link>
  );
}
