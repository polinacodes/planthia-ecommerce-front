// src/app/blog/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import TextTabs from '@/components/layout/TextTabs';
import NewsletterBlock from '@/components/layout/NewsletterBlock';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { PAGE_CONTAINER } from '@/lib/layout';
import ArticleCard, { FeaturedArticleCard } from '@/components/blog/ArticleCard';
import { BLOG_CATEGORIES, getArticles, isBlogCategory } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Planthia',
  description: 'Ideas, trucos y cuidados para tu jungla urbana: riego, luz, aromáticas, decoración con plantas y más.',
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  // La categoría vive en la URL (/blog?categoria=huerta): se puede compartir
  const { categoria } = await searchParams;
  const category = isBlogCategory(categoria) ? categoria : undefined;
  const articles = await getArticles(category);

  // Sin filtro, el más reciente va destacado arriba
  const featured = category ? undefined : articles[0];
  const rest = category ? articles : articles.slice(1);

  const tabs = [{ id: undefined, label: 'Todos' }, ...BLOG_CATEGORIES].map((c) => ({
    label: c.label,
    active: category === c.id,
    href: c.id ? `/blog?categoria=${c.id}` : '/blog',
  }));

  return (
    <>
    <main className="bg-planthia-cream pb-24">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
        <PageHeader eyebrow="#DiarioVerde" title="Blog" subtitle="Ideas, trucos y cuidados para tu jungla urbana." />

        <div className="border-b border-planthia-dark/10 flex items-end justify-between gap-6">
          <TextTabs tabs={tabs} className="min-w-0" />
          <p className="hidden sm:block flex-none pb-3 text-xs font-bold tracking-[0.15em] uppercase text-planthia-dark/50">
            {articles.length} {articles.length === 1 ? 'artículo' : 'artículos'}
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="mt-10 sm:mt-12 space-y-14 sm:space-y-16">
            {featured && <Reveal><FeaturedArticleCard article={featured} /></Reveal>}
            {rest.length > 0 && (
              <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {rest.map((article) => (
                  <RevealItem key={article.documentId}>
                    <ArticleCard article={article} />
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-headline font-extrabold text-2xl text-planthia-dark mb-2">Todavía no hay artículos acá</p>
            <p className="text-planthia-dark/60 mb-6">Estamos escribiendo. Mientras tanto, mirá las otras categorías.</p>
            <Link href="/blog" className="btn btn-secondary btn-md">Ver todos los artículos</Link>
          </div>
        )}
      </div>
    </main>
    {/* Newsletter a todo el ancho, pegada al footer */}
    <NewsletterBlock containerClassName={PAGE_CONTAINER} />
    </>
  );
}
