// src/components/blog/ArticleCard.tsx
import Image from 'next/image';
import Link from 'next/link';
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
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
    />
  ) : (
    <div className="absolute inset-0 bg-planthia-gradient bg-[#e7eedf]" />
  );
}

export function CategoryChip({ category }: { category: string }) {
  return (
    <span className="self-start inline-block text-[11px] font-headline font-bold uppercase tracking-[0.12em] text-planthia-green-dark bg-planthia-green/10 rounded-full px-3 py-1">
      {categoryLabel(category)}
    </span>
  );
}

function Meta({ article }: { article: Article }) {
  return (
    <p className="text-xs text-planthia-dark/50">
      {formatArticleDate(article.publishedAt)}
      {article.reading_time ? ` · ${article.reading_time} min de lectura` : ''}
    </p>
  );
}

// Artículo destacado (el más reciente): imagen grande al costado
export function FeaturedArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group grid md:grid-cols-[1.15fr_1fr] bg-white rounded-3xl overflow-hidden border border-planthia-dark/[0.06]"
    >
      <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden">
        <Cover article={article} sizes="(max-width: 768px) 100vw, 55vw" priority />
      </div>
      <div className="p-6 sm:p-10 flex flex-col justify-center gap-4">
        <CategoryChip category={article.category} />
        <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-planthia-dark leading-tight group-hover:text-planthia-green transition-colors">
          {article.title}
        </h2>
        {article.excerpt && <p className="text-planthia-dark/60 leading-relaxed">{article.excerpt}</p>}
        <Meta article={article} />
      </div>
    </Link>
  );
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-planthia-dark/[0.06]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Cover article={article} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
      </div>
      <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
        <CategoryChip category={article.category} />
        <h3 className="font-headline font-extrabold text-lg text-planthia-dark leading-snug group-hover:text-planthia-green transition-colors">
          {article.title}
        </h3>
        {article.excerpt && <p className="text-sm text-planthia-dark/60 leading-relaxed line-clamp-2">{article.excerpt}</p>}
        <div className="mt-auto pt-1">
          <Meta article={article} />
        </div>
      </div>
    </Link>
  );
}
