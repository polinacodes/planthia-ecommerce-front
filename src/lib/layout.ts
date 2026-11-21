// src/lib/layout.ts
// Contenedores compartidos.

// Para franjas de la home que ocupan todo el ancho (beneficios, newsletter):
// replica los márgenes del <main> de la home + los de cada sección, así el contenido
// queda alineado con "Explorá por categoría", el blog, etc. en cualquier pantalla.
export const HOME_CONTAINER = 'max-w-[1696px] mx-auto px-4 sm:px-6 md:px-10 lg:px-24';

// El mismo ancho que el nav (shop, guía, blog)
export const PAGE_CONTAINER = 'max-w-[1600px] mx-auto px-6 sm:px-12';
