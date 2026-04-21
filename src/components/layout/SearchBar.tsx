"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [text, setText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setText(searchQuery);
    } else {
      setText('');
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const params = new URLSearchParams(searchParams.toString());
    
      params.set('search', text.trim());
      
      router.push(`/tienda?${params.toString()}`);
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    setText('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/tienda?${params.toString()}`);
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-end h-10">
      <AnimatePresence>
        {isExpanded && (
          <motion.form
            initial={{ width: 0, opacity: 0, x: 20 }}
            animate={{ width: 220, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            onSubmit={handleSubmit}
            className="absolute right-full mr-2 z-10 flex items-center"
          >
            <input
              autoFocus
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Buscar plantas..."
              className="w-full bg-gray-100 border-none py-1.5 pl-4 pr-8 rounded-full text-sm outline-none focus:ring-1 focus:ring-planthia-green/30"
            />
            {text && (
              <button 
                type="button" 
                onClick={handleClear}
                className="absolute right-2 text-gray-400 hover:text-planthia-dark"
              >
                <X size={14} />
              </button>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`hover:text-planthia-green transition-colors p-1 z-20 ${isExpanded ? 'text-planthia-green' : 'text-planthia-dark'}`}
      >
        <Search size={20} className="sm:w-[22px] sm:h-[22px] cursor-pointer" />
      </button>
    </div>
  );
};

export default SearchBar;