"use client";
import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      
      {/* LA FOTO */}
      <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>

      {/* EL TEXTO */}
      <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-6"></div>

      <div className="flex justify-between items-center mt-auto">
        <div className="h-7 bg-gray-200 rounded-full w-1/3"></div>
        <div className="w-10 h-10 bg-[#5B823B]/20 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;