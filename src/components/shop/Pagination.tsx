"use client";
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, setCurrentPage }: PaginationProps) => {

  if (totalPages <= 1) return null;

  const handlePageChange = (num: number) => {
    setCurrentPage(num);
    window.scrollTo(0, 0);
  };

  return (
    <div className="mt-16 flex justify-center items-center gap-2">
      {/* Botón Anterior */}
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 text-gray-400 hover:text-[#5B823B] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      {/* Números de página */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => handlePageChange(num)}
          className={`w-10 h-10 rounded-lg font-bold transition-colors ${num === currentPage
              ? 'bg-[#5B823B] text-white'
              : 'text-gray-500 hover:bg-[#5B823B]/20'
            }`}
        >
          {num}
        </button>
      ))}

      {/* Botón Siguiente */}
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-400 hover:text-[#5B823B] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;