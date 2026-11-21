// src/app/blog/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
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

  const chips = [{ id: undefined, label: 'Todos' }, ...BLOG_CATEGORIES];

  return (
    <main className="min-h-screen bg-planthia-cream pb-24">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-6">
        <section className="rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center bg-white bg-planthia-gradient">
          <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark uppercase">#DiarioVerde</span>
          <h1 className="font-headline font-extrabold text-4xl sm:text-5xl text-planthia-dark mt-3 mb-3">Blog</h1>
          <p className="text-planthia-dark/60 text-base sm:text-lg max-w-xl mx-auto">
            Ideas, trucos y cuidados para tu jungla urbana.
          </p>

          <div className="mt-8 -mx-6 px-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2 w-max mx-auto">
              {chips.map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.id ? `/blog?categoria=${chip.id}` : '/blog'}
                  scroll={false}
                  className={`btn btn-sm ${category === chip.id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {articles.length > 0 ? (
          <div className="mt-10 space-y-6 sm:space-y-8">
            {featured && <FeaturedArticleCard article={featured} />}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {rest.map((article) => (
                  <ArticleCard key={article.documentId} article={article} />
                ))}
              </div>
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
  );
}
