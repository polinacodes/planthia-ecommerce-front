// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ArticleContent from '@/components/blog/ArticleContent';
import ArticleToc from '@/components/blog/ArticleToc';
import ProductRow from '@/components/products/ProductRow';
import { categoryLabel, formatArticleDate, getArticle, getHeadings } from '@/lib/blog';

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

// Productos del artículo en filas compactas
function ProductList({ products }: { products: any[] }) {
  return (
    <div>
      <p className="font-headline font-bold tracking-[0.2em] text-[11px] text-planthia-dark/50 uppercase mb-2">Lo que necesitás</p>
      <div className="divide-y divide-planthia-dark/10">
        {products.map((product) => (
          <ProductRow key={product.documentId} product={product} compact />
        ))}
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const products = (article.products ?? []).filter((p) => p.publishedAt !== null);
  const headings = getHeadings(article.content);
  const hasSidebar = headings.length > 0 || products.length > 0;

  return (
    <main className="min-h-screen bg-planthia-cream pb-24">
      <article className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {/* Encabezado alineado a la izquierda, como el resto de las secciones */}
        <header className="pt-8 sm:pt-12">
          <nav className="text-[10px] uppercase tracking-[0.2em] text-planthia-dark/60 mb-6 flex flex-wrap gap-x-2">
            <Link href="/blog" className="hover:text-planthia-green transition-colors">Blog</Link>
            <span className="text-planthia-dark/30">/</span>
            <Link href={`/blog?categoria=${article.category}`} className="hover:text-planthia-green transition-colors">
              {categoryLabel(article.category)}
            </Link>
          </nav>
          <h1 className="max-w-4xl font-headline font-extrabold text-4xl sm:text-5xl xl:text-6xl leading-[1.05] tracking-tight text-planthia-dark break-words">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="max-w-2xl text-lg sm:text-xl text-planthia-dark/60 leading-relaxed mt-5">{article.excerpt}</p>
          )}
          <p className="text-xs uppercase tracking-[0.15em] text-planthia-dark/50 mt-6">
            {formatArticleDate(article.publishedAt)}
            {article.reading_time ? ` · ${article.reading_time} min de lectura` : ''}
          </p>
        </header>

        {/* Portada a todo el ancho del contenido */}
        {article.cover && (
          <div className="relative aspect-[16/10] md:aspect-[2/1] rounded-3xl overflow-hidden mt-10 sm:mt-12 bg-white">
            <Image
              src={article.cover.url}
              alt={article.cover.alternativeText || article.title}
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1300px"
              className="object-cover"
            />
          </div>
        )}

        {/* Texto a la izquierda + columna fija a la derecha (índice y productos) */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] gap-12 xl:gap-20 mt-12 sm:mt-16">
          <div className="max-w-[720px] min-w-0">
            {article.content && <ArticleContent content={article.content} />}

            {/* En celular y tablet los productos van al final del texto */}
            {products.length > 0 && (
              <div className="lg:hidden mt-12">
                <ProductList products={products} />
              </div>
            )}

            <div className="mt-14 pt-8 border-t border-planthia-dark/10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-headline font-bold text-sm uppercase tracking-[0.15em] text-planthia-green hover:text-planthia-green-dark transition-colors"
              >
                <ArrowLeft size={18} /> Ver todos los artículos
              </Link>
            </div>
          </div>

          {hasSidebar && (
            <aside className="hidden lg:block sticky top-28 self-start border-l border-planthia-dark/10 pl-10 space-y-10">
              <ArticleToc headings={headings} />
              {products.length > 0 && <ProductList products={products} />}
            </aside>
          )}
        </div>
      </article>
    </main>
  );
}
