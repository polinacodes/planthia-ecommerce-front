// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ArticleContent from '@/components/blog/ArticleContent';
import ProductRow from '@/components/products/ProductRow';
import { categoryLabel, formatArticleDate, getArticle } from '@/lib/blog';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Artículo no encontrado | Planthia' };

  return {
    title: `${article.title} | Blog Planthia`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: 'article',
      images: article.cover ? [article.cover.url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const products = (article.products ?? []).filter((p) => p.publishedAt !== null);

  return (
    <main className="min-h-screen bg-planthia-cream pb-24">
      <article className="max-w-[1100px] mx-auto px-6 sm:px-12 pt-10 sm:pt-14">
        {/* Encabezado */}
        <header className="max-w-[760px] mx-auto">
          <nav className="text-[10px] uppercase tracking-[0.2em] text-planthia-dark/60 mb-6 flex flex-wrap gap-x-2">
            <Link href="/blog" className="hover:text-planthia-green transition-colors">Blog</Link>
            <span className="text-planthia-dark/30">/</span>
            <Link href={`/blog?categoria=${article.category}`} className="hover:text-planthia-green transition-colors">
              {categoryLabel(article.category)}
            </Link>
          </nav>
          <h1 className="font-headline font-extrabold text-4xl sm:text-5xl text-planthia-dark leading-[1.1] break-words">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg sm:text-xl text-planthia-dark/60 leading-relaxed mt-5">{article.excerpt}</p>
          )}
          <p className="text-xs uppercase tracking-[0.15em] text-planthia-dark/50 mt-6">
            {formatArticleDate(article.publishedAt)}
            {article.reading_time ? ` · ${article.reading_time} min de lectura` : ''}
          </p>
        </header>

        {/* Portada */}
        {article.cover && (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mt-10 bg-white">
            <Image src={article.cover.url} alt={article.cover.alternativeText || article.title} fill priority sizes="(max-width: 1100px) 100vw, 1100px" className="object-cover" />
          </div>
        )}

        {/* Contenido */}
        <div className="max-w-[760px] mx-auto mt-10 sm:mt-14">
          {article.content && <ArticleContent content={article.content} />}

          {/* Productos mencionados */}
          {products.length > 0 && (
            <section className="mt-14 bg-white/60 border border-planthia-dark/[0.06] rounded-3xl p-5 sm:p-7">
              <p className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-green uppercase mb-5">
                Productos del artículo
              </p>
              <div className="space-y-3">
                {products.map((product) => (
                  <ProductRow key={product.documentId} product={product} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-14 pt-8 border-t border-planthia-dark/10">
            <Link href="/blog" className="inline-flex items-center gap-2 font-headline font-bold text-sm uppercase tracking-[0.15em] text-planthia-green hover:text-planthia-green-dark transition-colors">
              <ArrowLeft size={18} /> Ver todos los artículos
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
