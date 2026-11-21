// src/lib/guide.ts
// Lógica de la guía de cuidados: arma las fichas a partir de las plantas de la tienda
// (su metadata en Strapi) y recomienda insumos según lo que necesita cada planta.

/** "Monstera Deliciosa" → "monstera-deliciosa" (sin tildes ni símbolos) */
export function slugify(text: string): string {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Sin tildes y en minúsculas, para comparar textos */
export const normalizeText = (value: unknown) =>
  String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Solo las plantas con metadata cargada aparecen en la guía */
export const isGuidePlant = (product: any) => product?.type === 'plantas' && !!product?.metadata;

/** Etiqueta corta de luz para las cards, a partir de las casillas de Strapi */
export function lightLabel(metadata: any): string {
  const shade = metadata?.light_shade === true;
  const indirect = metadata?.light_indirect === true;
  const sun = metadata?.light_sun === true;
  if (shade && indirect && sun) return 'Toda luz';
  if (sun && indirect) return 'Sol o indirecta';
  if (shade && indirect) return 'Poca luz';
  if (sun) return 'Sol';
  if (indirect) return 'Indirecta';
  if (shade) return 'Sombra';
  return metadata?.light || 'Sin dato';
}

export const difficultyLabel = (metadata: any) =>
  metadata?.difficulty === 'experto' ? 'Para expertos' : metadata?.difficulty === 'principiante' ? 'Fácil de cuidar' : null;

/** Consejos: uno por renglón en Strapi → lista */
export const careTipsList = (metadata: any): string[] =>
  String(metadata?.care_tips ?? '')
    .split('\n')
    .map((tip) => tip.trim())
    .filter(Boolean);

// ============================================
// FILTROS RÁPIDOS DEL BUSCADOR
// ============================================

export const GUIDE_FILTERS = [
  { id: 'todas', label: 'Todas', test: () => true },
  { id: 'faciles', label: 'Fáciles de cuidar', test: (p: any) => p.metadata?.difficulty === 'principiante' },
  { id: 'mascotas', label: 'Pet friendly', test: (p: any) => p.metadata?.pet_friendly === true },
  { id: 'poca-luz', label: 'Poca luz', test: (p: any) => p.metadata?.light_shade === true },
  { id: 'sol', label: 'Pleno sol', test: (p: any) => p.metadata?.light_sun === true },
  { id: 'aromaticas', label: 'Aromáticas', test: (p: any) => normalizeText(p.subcategory?.name) === 'aromaticas' },
] as const;

export type GuideFilterId = (typeof GUIDE_FILTERS)[number]['id'];

/** Nombres populares con los que la gente busca cada planta (clave: parte del nombre en la tienda) */
const POPULAR_NAMES: Record<string, string[]> = {
  pothos: ['potus', 'poto'],
  monstera: ['costilla de adan'],
  ficus: ['gomero'],
  sansevieria: ['lengua de suegra', 'sanseviera', 'espada de san jorge'],
  spathiphyllum: ['espatifilo', 'cuna de moises', 'lirio de la paz'],
  malvon: ['geranio'],
  'violeta de los alpes': ['ciclamen'],
  copete: ['tagetes', 'clavel de muerto'],
  agapanthus: ['agapanto'],
  'jazmin del cabo': ['gardenia'],
  anthurium: ['anturio'],
  'palmera areca': ['areca'],
  alocasia: ['oreja de elefante'],
  dimorfoteca: ['margarita africana'],
};

/** Busca por nombre, nombre científico, tags y nombres populares ("potus" encuentra al Pothos) */
export function matchesSearch(product: any, query: string): boolean {
  const q = normalizeText(query);
  if (!q) return true;
  const name = normalizeText(product.name);
  const popular = Object.entries(POPULAR_NAMES)
    .filter(([key]) => name.includes(key))
    .flatMap(([, names]) => names);
  const haystack = [
    product.name,
    product.metadata?.scientificName,
    ...(Array.isArray(product.tags) ? product.tags : []),
    ...popular,
  ].map(normalizeText).join(' ');
  return haystack.includes(q) || q.split(/\s+/).every((word) => haystack.includes(word));
}

// ============================================
// RECOMENDACIONES DE INSUMOS
// ============================================

/**
 * Cada regla dice qué insumo buscar (por palabras de su nombre) y cuándo recomendarlo
 * según la metadata de la planta. Las palabras se buscan sin tildes.
 */
const RECOMMENDATION_RULES: { product: string[]; when: (m: any) => boolean; reason: string }[] = [
  { product: ['fibra de coco'], when: (m) => /coco/.test(normalizeText(m.substratum)), reason: 'Base del sustrato que necesita' },
  { product: ['perlita'], when: (m) => /perlita|drena|poroso|aireado|suelto|arenoso|ligero/.test(normalizeText(m.substratum)), reason: 'Para mejorar el drenaje' },
  { product: ['humus'], when: (m) => /humus|fertil|rico/.test(normalizeText(m.substratum)), reason: 'Nutrientes naturales' },
  { product: ['compost'], when: (m) => /compost|materia organica/.test(normalizeText(m.substratum)), reason: 'Materia orgánica para el suelo' },
  { product: ['vermiculita'], when: (m) => /vermiculita|retenga humedad|retentor/.test(normalizeText(m.substratum)), reason: 'Para retener humedad' },
  { product: ['musgo sphagnum'], when: (m) => /musgo|sphagnum|orquidea/.test(normalizeText(m.substratum)), reason: 'Sustrato para epífitas' },
  { product: ['tutor'], when: (m) => /trepadora/.test(normalizeText(m.type_plant)), reason: 'Le encanta trepar' },
  { product: ['pulverizador'], when: (m) => normalizeText(m.humidity) === 'alta', reason: 'Le gusta la humedad ambiental' },
];

/** Insumos de la tienda recomendados para esta planta (máximo 4, con stock primero) */
export function getRecommendedProducts(plant: any, allProducts: any[]): { product: any; reason: string }[] {
  const metadata = plant?.metadata;
  if (!metadata) return [];

  const supplies = allProducts.filter((p) => p.type === 'cuidados');
  const picked: { product: any; reason: string }[] = [];

  for (const rule of RECOMMENDATION_RULES) {
    if (!rule.when(metadata)) continue;
    const match = supplies
      .filter((p) => rule.product.some((word) => normalizeText(p.name).includes(word)))
      .sort((a, b) => (Number(b.stock) > 0 ? 1 : 0) - (Number(a.stock) > 0 ? 1 : 0))[0];
    if (match && !picked.some((r) => r.product.documentId === match.documentId)) {
      picked.push({ product: match, reason: rule.reason });
    }
    if (picked.length === 4) break;
  }
  return picked;
}
