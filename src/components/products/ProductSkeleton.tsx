"use client";
import { motion } from "framer-motion";

const ProductSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Contenedor de Imagen */}
      <div className="relative aspect-[4/5] bg-gray-200 rounded-[32px] overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </div>

      {/* Textos del Skeleton */}
      <div className="space-y-3 px-2">
        <div className="h-3 w-20 bg-gray-200 rounded-full" /> 
        <div className="h-6 w-3/4 bg-gray-200 rounded-lg" />  
        <div className="h-4 w-full bg-gray-200 rounded-md" /> 
        
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-16 bg-gray-200 rounded-md" /> 
          <div className="h-10 w-24 bg-gray-200 rounded-full" /> 
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;