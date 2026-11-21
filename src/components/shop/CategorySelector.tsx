"use client";

import { motion } from 'framer-motion';

interface CategorySelectorProps {
  typeQuery: string;
  categoryQuery: string;
  hasSearch?: boolean;
  onFilterChange: (key: string, value: string) => void;
  withTypeSwitch?: boolean;
}

// El valor interno sigue siendo 'cuidados' (así está en Strapi y en la URL)
const TYPES = [
  { value: 'plantas', label: 'Plantas' },
  { value: 'cuidados', label: 'Insumos' },
];

const SUBCATEGORIES: Record<string, { value: string; label: string }[]> = {
  plantas: [
    { value: 'todas', label: 'Todas' },
    { value: 'interior', label: 'Interior' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'aromaticas', label: 'Aromáticas' },
  ],
  cuidados: [
    { value: 'todas', label: 'Todos' },
    { value: 'herramientas', label: 'Herramientas' },
    { value: 'accesorios', label: 'Accesorios' },
    { value: 'sustratos', label: 'Sustratos' },
  ],
};

// Interruptor Plantas / Insumos (en la tienda va al lado del título)
export const TypeSwitch = ({ typeQuery, hasSearch = false, onFilterChange }: Pick<CategorySelectorProps, 'typeQuery' | 'hasSearch' | 'onFilterChange'>) => (
  <div className="flex-none inline-flex bg-white border border-gray-200 rounded-full p-1">
    {TYPES.map(({ value, label }) => {
      const isActive = !hasSearch && typeQuery === value;
      return (
        <button
          key={value}
          onClick={() => onFilterChange('type', value)}
          className={`relative px-4 py-1.5 md:px-5 rounded-full text-sm font-bold cursor-pointer transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-500 hover:text-[#5B823B]'
            }`}
        >
          {/* El fondo verde se desliza de una opción a la otra */}
          {isActive && (
            <motion.span
              layoutId="shop-type-pill"
              className="absolute inset-0 rounded-full bg-[#5B823B]"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          <span className="relative">{label}</span>
        </button>
      );
    })}
  </div>
);

// Selector en una sola línea: interruptor Plantas / Insumos + subcategorías en texto.
// En celular, si no entra, se desliza de costado (con un fundido a la derecha que lo sugiere).
const CategorySelector = ({ typeQuery, categoryQuery, hasSearch = false, onFilterChange, withTypeSwitch = true }: CategorySelectorProps) => {
  const subcategories = SUBCATEGORIES[typeQuery] ?? SUBCATEGORIES.plantas;

  return (
    <div className="mb-4 md:mb-6 -mx-6 px-6 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:[mask-image:none]">
      <div className="flex items-center gap-4 md:gap-6 w-max pr-8 sm:pr-0">
        {withTypeSwitch && (
          <TypeSwitch typeQuery={typeQuery} hasSearch={hasSearch} onFilterChange={onFilterChange} />
        )}

        {/* Subcategorías en texto */}
        {subcategories.map(({ value, label }) => {
          const isActive = !hasSearch && categoryQuery === value;
          return (
            <button
              key={value}
              onClick={() => onFilterChange('category', value)}
              className={`flex-none text-sm font-semibold cursor-pointer transition-colors duration-200 underline-offset-8 decoration-2 ${isActive
                ? 'text-[#3f6224] underline decoration-[#5B823B]'
                : 'text-gray-500 hover:text-[#5B823B]'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
