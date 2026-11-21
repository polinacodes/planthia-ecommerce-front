// src/components/home/BlogSection.tsx
// Últimas entradas del blog en la home. Si no hay artículos publicados, la sección no se muestra.
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ArticleCard from '@/components/blog/ArticleCard';
import { Article, getArticles } from '@/lib/blog';

const LATEST_COUNT = 3;

export default function BlogSection() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles(undefined, LATEST_COUNT).then((list) => setArticles(list.slice(0, LATEST_COUNT)));
  }, []);

  if (articles.length === 0) return null;

  const allLink = (
    <Link
      href="/blog"
      className="group inline-flex items-center gap-2 font-headline font-bold text-xs uppercase tracking-[0.15em] text-planthia-green hover:text-planthia-green-dark transition-colors"
    >
      Ver todos los artículos
      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );

  return (
    <section className="bg-cream pt-16 sm:pt-20 pb-4 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      {/* Encabezado: mismo sistema que "Explorá por categoría" */}
      <div className="flex items-end justify-between gap-6 mb-8 sm:mb-10">
        <div>
          <span className="font-headline font-bold tracking-[0.2em] text-xs text-planthia-dark mb-3 block uppercase">
            #DiarioVerde
          </span>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl xl:text-5xl leading-[1.1] text-planthia-dark">
            Del blog
          </h2>
          <p className="font-body text-planthia-dark/60 mt-3 text-base sm:text-lg max-w-xl leading-relaxed">
            Ideas, trucos y cuidados para tu jungla urbana.
          </p>
        </div>
        <div className="hidden md:block flex-none pb-2">{allLink}</div>
      </div>

      {/* En celular se deslizan de costado; desde tablet, grilla */}
      <div className="-mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 flex md:grid md:grid-cols-3 gap-5 lg:gap-8 scroll-px-4 sm:scroll-px-6 md:scroll-px-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {articles.map((article) => (
          <div key={article.documentId} className="flex-[0_0_80%] sm:flex-[0_0_55%] md:flex-auto snap-start">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      <div className="md:hidden mt-8">{allLink}</div>
    </section>
  );
}
