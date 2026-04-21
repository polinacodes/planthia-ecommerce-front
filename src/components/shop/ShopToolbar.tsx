"use client";
import React from 'react';
import { SlidersHorizontal, ChevronDown, ArrowUpDown, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopToolbarProps {

  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  isSortOpen: boolean;
  setIsSortOpen: (open: boolean) => void;

  lightQuery: string;
  diffQuery: string;
  petQuery: boolean;
  sortQuery: string;
  typeQuery: string; 

  totalProducts: number;
  updateFilter: (key: string, value: string) => void;
  sortLabels: Record<string, string>;
}

const ShopToolbar = ({
  isFilterOpen, setIsFilterOpen,
  isSortOpen, setIsSortOpen,
  lightQuery, diffQuery, petQuery, sortQuery, typeQuery, 
  totalProducts, updateFilter, sortLabels
}: ShopToolbarProps) => {
  
  const showFilters = typeQuery === 'plantas';

  return (
    <div className="flex justify-between items-center border-b border-gray-200 pb-4 md:pb-6 mb-6 md:mb-12">
      {/* SECCIÓN FILTRAR - Solo visible en plantas */}
      {showFilters && (
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#5B823B] transition-colors cursor-pointer focus:outline-none"
            >
              <SlidersHorizontal size={18} />
              FILTRAR
              <motion.div animate={{ rotate: isFilterOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 left-0 w-64 bg-white shadow-2xl rounded-2xl p-6 z-40 border border-gray-100 origin-top-left"
                  >
                    {/* Necesidad de Luz */}
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Necesidad de Luz</p>
                      <div className="space-y-2">
                        {['sombra', 'indirecta', 'sol'].map((luz) => (
                          <label key={luz} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={lightQuery.split(',').includes(luz)}
                              onChange={() => {
                                const current = lightQuery ? lightQuery.split(',') : [];
                                const next = current.includes(luz) ? current.filter(l => l !== luz) : [...current, luz];
                                updateFilter('light', next.join(','));
                              }}
                              className="w-4 h-4 rounded border-gray-300 accent-planthia-green text-[#5B823B] focus:ring-[#5B823B]"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-[#5B823B] capitalize">{luz}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Dificultad */}
                    <div className="mb-6 border-t border-gray-100 pt-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dificultad</p>
                      <div className="space-y-2">
                        {['principiante', 'experto'].map((dif) => (
                          <label key={dif} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={diffQuery.split(',').includes(dif)}
                              onChange={() => {
                                const current = diffQuery ? diffQuery.split(',') : [];
                                const next = current.includes(dif) ? current.filter(d => d !== dif) : [...current, dif];
                                updateFilter('difficulty', next.join(','));
                              }}
                              className="w-4 h-4 rounded border-gray-300 accent-planthia-green text-[#5B823B] focus:ring-[#5B823B]"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-[#5B823B] capitalize">{dif}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pet Friendly */}
                    <div className="border-t border-gray-100 pt-4">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <PawPrint size={16} className={`transition-colors ${petQuery ? 'text-planthia-green' : 'text-gray-400 group-hover:text-gray-600'}`} />
                          <span className="text-sm font-bold text-gray-600">Pet Friendly</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={petQuery}
                          onChange={() => updateFilter('petFriendly', (!petQuery).toString())}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#5B823B] relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <span className="hidden md:block text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {totalProducts} Productos encontrados
          </span>
        </div>
      )}

      {!showFilters && (
        <div className="flex items-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {totalProducts} Productos encontrados
          </span>
        </div>
      )}

      {/* Selector Ordenar */}
      <div className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#5B823B] transition-all uppercase tracking-wider focus:outline-none cursor-pointer"
        >
          <ArrowUpDown size={18} className="text-gray-500" />
          <span>{sortLabels[sortQuery]}</span>
          <motion.div animate={{ rotate: isSortOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isSortOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-10 w-60 bg-white shadow-2xl rounded-2xl p-2 z-40 border border-gray-100 origin-top-right"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      updateFilter('sort', value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-colors cursor-pointer ${sortQuery === value ? 'bg-[#5B823B]/10 text-[#5B823B] font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShopToolbar;