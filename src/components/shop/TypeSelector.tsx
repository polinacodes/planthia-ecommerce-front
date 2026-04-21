"use client";

interface TypeSelectorProps {
  typeQuery: string;
  searchQuery: string;
  onTypeChange: (type: string) => void;
}

const TypeSelector = ({ typeQuery, searchQuery, onTypeChange }: TypeSelectorProps) => {
  return (
    <div className="flex gap-4 justify-center my-6">
      <button
        onClick={() => onTypeChange('plantas')}
        className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full cursor-pointer text-xs md:text-sm font-bold transition-all border ${searchQuery
            ? 'bg-white text-gray-500 border-gray-200 hover:border-[#5B823B] hover:text-[#5B823B]'
            : typeQuery === 'plantas'
              ? 'bg-[#5B823B] text-white border-[#5B823B]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-[#5B823B] hover:text-[#5B823B]'
          }`}
      >
        Plantas
      </button>
      <button
        onClick={() => onTypeChange('cuidados')}
        className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full cursor-pointer text-xs md:text-sm font-bold transition-all border ${searchQuery
            ? 'bg-white text-gray-500 border-gray-200 hover:border-[#5B823B] hover:text-[#5B823B]'
            : typeQuery === 'cuidados'
              ? 'bg-[#5B823B] text-white border-[#5B823B]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-[#5B823B] hover:text-[#5B823B]'
          }`}
      >
        Cuidados
      </button>
    </div>
  );
};

export default TypeSelector;