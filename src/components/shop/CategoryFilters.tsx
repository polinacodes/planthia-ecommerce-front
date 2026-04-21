"use client";

interface CategoryFiltersProps {
  type?: string;
  categoryQuery: string;
  onFilterChange: (key: string, value: string) => void;
}

const CategoryFilters = ({ type = 'plantas', categoryQuery, onFilterChange }: CategoryFiltersProps) => {
  
  const categories = type === 'plantas' 
    ? ['todas', 'interior', 'exterior', 'aromaticas']
    : ['todas', 'herramientas', 'accesorios', 'sustratos'];

  return (
    <div className="flex justify-center gap-2 mb-12 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange('category', cat)}
          className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full cursor-pointer text-xs md:text-sm font-bold transition-all border ${
            categoryQuery === cat
              ? 'bg-[#5B823B] text-white border-[#5B823B]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-[#5B823B] hover:text-[#5B823B]'
          }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;