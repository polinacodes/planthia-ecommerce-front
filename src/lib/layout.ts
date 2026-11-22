// src/lib/layout.ts
// Contenedores compartidos.

// Secciones y franjas de la home (beneficios, newsletter, footer): desde tablet quedan
// alineadas con el nav (48px a los costados, máximo 1600px). En celular conservan sus
// márgenes propios (16 y 24px). En pantallas de más de 1696px el resultado es idéntico al anterior.
export const HOME_CONTAINER = 'max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12';

// El mismo ancho que el nav (shop, guía, blog)
export const PAGE_CONTAINER = 'max-w-[1600px] mx-auto px-6 sm:px-12';
