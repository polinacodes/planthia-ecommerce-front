'use client';
// src/components/share/ShareButton.tsx
// Botón para compartir una página (producto, ficha de la guía o artículo del blog).
// - En celular abre el menú nativo del teléfono (WhatsApp, Instagram, Telegram… lo que tenga instalado).
// - En compu abre un menú propio: copiar link, WhatsApp, Facebook y Pinterest.
// La vista previa (foto, título y descripción) sale de los metadatos SEO de cada página.
import { useEffect, useRef, useState } from 'react';
import { Link as LinkIcon, Share2 } from 'lucide-react';
import { toast } from 'sonner';

// Íconos de marca (Lucide ya no los trae). Trazados de Simple Icons
const BRAND_PATHS = {
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  facebook: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  pinterest: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z',
} as const;

function BrandIcon({ name, size = 18 }: { name: keyof typeof BRAND_PATHS; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}

interface ShareProps {
  /** Ruta de la página, por ejemplo /shop/anthurium */
  path: string;
  title: string;
  text?: string;
  /** Foto para Pinterest (si no hay, Pinterest la busca en la página) */
  image?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planthia.vercel.app';
const enc = encodeURIComponent;

function shareLinks({ path, title, image }: ShareProps) {
  // Siempre la dirección pública del sitio (igual en el servidor y en el navegador)
  const url = new URL(path, SITE_URL).toString();
  return {
    url,
    whatsapp: `https://wa.me/?text=${enc(`${title} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${enc(url)}&description=${enc(title)}${image ? `&media=${enc(image)}` : ''}`,
  };
}

async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.success('Link copiado');
  } catch {
    toast.error('No se pudo copiar el link');
  }
}

// Menú nativo solo en pantallas táctiles: en Windows y Mac el navegador también lo tiene,
// pero abre un panel del sistema poco práctico, así que ahí se usa el menú propio
function canUseNativeShare() {
  return typeof navigator !== 'undefined' && !!navigator.share && window.matchMedia('(pointer: coarse)').matches;
}

async function nativeShare({ title, text, url }: { title: string; text?: string; url: string }) {
  try {
    await navigator.share({ title, text, url });
  } catch {
    // La persona cerró el menú sin compartir: no hace falta avisar nada
  }
}

const MENU_ITEM =
  'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-planthia-dark hover:bg-[#f3f7ef] cursor-pointer transition-colors';

const TRIGGER_STYLES = {
  // Mismo círculo que el botón de favoritos de la ficha de producto
  circle:
    'p-2 sm:p-3 lg:p-4 rounded-full cursor-pointer border border-[#dfe5d8] bg-white text-planthia-green hover:border-planthia-green hover:bg-[#f3f7ef] transition-all duration-300 flex-shrink-0',
  // Pastilla con texto, para la línea de las migas de pan o de la fecha
  pill:
    'inline-flex items-center gap-1.5 rounded-full cursor-pointer border border-[#dfe5d8] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-planthia-green hover:border-planthia-green hover:bg-[#f3f7ef] transition-colors',
};

export default function ShareButton({
  variant = 'circle',
  align = 'right',
  className = '',
  ...share
}: ShareProps & { variant?: 'circle' | 'pill'; align?: 'left' | 'right'; className?: string }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer clic afuera o con Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleClick = () => {
    const { url } = shareLinks(share);
    if (canUseNativeShare()) nativeShare({ title: share.title, text: share.text, url });
    else setOpen((o) => !o);
  };

  const links = open ? shareLinks(share) : null;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={variant === 'circle' ? `Compartir ${share.title}` : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        className={TRIGGER_STYLES[variant]}
      >
        {variant === 'circle' ? (
          <Share2 size={18} strokeWidth={1.5} className="sm:w-5 sm:h-5" />
        ) : (
          <>
            <Share2 size={14} strokeWidth={2} /> Compartir
          </>
        )}
      </button>

      {links && (
        <div
          role="menu"
          className={`absolute z-40 top-full mt-2 w-52 bg-white rounded-2xl border border-[#dfe5d8] shadow-lg p-1.5 ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <button role="menuitem" type="button" className={MENU_ITEM} onClick={() => { copyLink(links.url); setOpen(false); }}>
            <LinkIcon size={18} className="text-planthia-green" /> Copiar link
          </button>
          <a role="menuitem" href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={MENU_ITEM} onClick={() => setOpen(false)}>
            <span className="text-planthia-green"><BrandIcon name="whatsapp" /></span> WhatsApp
          </a>
          <a role="menuitem" href={links.facebook} target="_blank" rel="noopener noreferrer" className={MENU_ITEM} onClick={() => setOpen(false)}>
            <span className="text-planthia-green"><BrandIcon name="facebook" /></span> Facebook
          </a>
          <a role="menuitem" href={links.pinterest} target="_blank" rel="noopener noreferrer" className={MENU_ITEM} onClick={() => setOpen(false)}>
            <span className="text-planthia-green"><BrandIcon name="pinterest" /></span> Pinterest
          </a>
        </div>
      )}
    </div>
  );
}

// Fila de íconos para el final de un artículo: "¿Te sirvió? Compartilo".
// Íconos directos (sin menú); en celular suma "Más opciones" con el menú del teléfono (ahí está Instagram)
export function ShareInline(share: ShareProps) {
  const [hasNative, setHasNative] = useState(false);
  useEffect(() => setHasNative(canUseNativeShare()), []);
  const links = shareLinks(share);
  const icon =
    'w-10 h-10 rounded-full border border-[#dfe5d8] bg-white text-planthia-green hover:border-planthia-green hover:bg-[#f3f7ef] flex items-center justify-center cursor-pointer transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* En celular el texto va en su propia línea, arriba de los íconos */}
      <span className="w-full sm:w-auto text-sm font-semibold text-planthia-dark/70 sm:mr-1">¿Te sirvió? Compartilo</span>
      <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Compartir por WhatsApp" className={icon}>
        <BrandIcon name="whatsapp" />
      </a>
      <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Compartir en Facebook" className={icon}>
        <BrandIcon name="facebook" />
      </a>
      <a href={links.pinterest} target="_blank" rel="noopener noreferrer" aria-label="Guardar en Pinterest" className={icon}>
        <BrandIcon name="pinterest" />
      </a>
      <button type="button" onClick={() => copyLink(shareLinks(share).url)} aria-label="Copiar link" className={icon}>
        <LinkIcon size={18} />
      </button>
      {hasNative && (
        <button type="button" onClick={() => nativeShare({ title: share.title, text: share.text, url: shareLinks(share).url })} aria-label="Más opciones para compartir" className={icon}>
          <Share2 size={18} />
        </button>
      )}
    </div>
  );
}
