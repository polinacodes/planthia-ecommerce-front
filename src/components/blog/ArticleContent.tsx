// src/components/blog/ArticleContent.tsx
// Muestra el contenido del artículo (Markdown escrito en Strapi) con los estilos de la marca.
import Link from 'next/link';
import ReactMarkdown, { Components } from 'react-markdown';

const components: Components = {
  h2: ({ children }) => (
    <h2 className="font-headline font-extrabold text-2xl sm:text-[28px] text-planthia-dark leading-tight mt-12 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-headline font-bold text-xl text-planthia-dark leading-snug mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => <p className="text-[17px] leading-[1.8] text-planthia-dark/75 mb-5">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 marker:text-planthia-green">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 marker:text-planthia-green marker:font-bold">{children}</ol>,
  li: ({ children }) => <li className="text-[17px] leading-[1.7] text-planthia-dark/75 pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-planthia-dark">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 bg-white rounded-2xl border border-planthia-dark/[0.06] px-6 py-5 [&>p]:mb-0 [&>p]:text-planthia-dark">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-planthia-dark/10" />,
  a: ({ href = '', children }) =>
    href.startsWith('/') ? (
      <Link href={href} className="text-planthia-green font-semibold underline underline-offset-4 decoration-planthia-green/30 hover:decoration-planthia-green">
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-planthia-green font-semibold underline underline-offset-4 decoration-planthia-green/30 hover:decoration-planthia-green">
        {children}
      </a>
    ),
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt }) => <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} className="w-full rounded-2xl my-8" loading="lazy" />,
};

export default function ArticleContent({ content }: { content: string }) {
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}
