"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import productsData from '@/data/products.json'; // Ajustá la ruta a tu JSON
import ProductCardShop from '@/components/products/ProductCardShop';

const TiendaPage = () => {
	const searchParams = useSearchParams();

	// 1. Obtener filtros de la URL
	const searchQuery = searchParams.get('search')?.toLowerCase() || '';
	const categoryQuery = searchParams.get('category') || 'todas';

	// 2. Lógica de filtrado inteligente (Nombre + Tags)
	const filteredProducts = useMemo(() => {
		return productsData.filter((product) => {
			const matchesSearch =
				product.name.toLowerCase().includes(searchQuery) ||
				product.commonName.toLowerCase().includes(searchQuery) ||
				product.tags.some(tag => tag.toLowerCase().includes(searchQuery));

			const matchesCategory =
				categoryQuery === 'todas' || product.category === categoryQuery;

			return matchesSearch && matchesCategory;
		});
	}, [searchQuery, categoryQuery]);

	// 3. Paginación (6 por página)
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 6;
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

	return (
		<div className="min-h-screen bg-cream pt-24 pb-16 px-6 sm:px-12">
			<div className="max-w-[1600px] mx-auto">

				{/* Cabecera de la Tienda */}
				<header className="mb-12 text-center">
					<h1 className="text-4xl md:text-5xl font-extrabold text-[#5B823B] mb-4">
						Nuestra Colección
					</h1>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Explorá nuestra selección premium de plantas curadas para transformar tu hogar en un refugio natural.
					</p>
				</header>

				{/* Barra de Filtros (Top Bar) */}
				<div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-6 mb-8 gap-4">
					<div className="flex gap-4">
						{/* Aquí irán tus botones de categoría y el botón de "Filtrar" */}
						<span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
							{filteredProducts.length} Productos encontrados
						</span>
					</div>

					<div className="flex gap-4">
						{/* Aquí irá el selector de Ordenamiento */}
						<select className="bg-transparent border-none text-sm font-bold text-[#5B823B] focus:ring-0 cursor-pointer">
							<option>Ordenar por: Relevancia</option>
							<option>Precio: Menor a Mayor</option>
							<option>Precio: Mayor a Menor</option>
						</select>
					</div>
				</div>

				{/* Grilla de Productos */}
				{currentProducts.length > 0 ? (
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
						{currentProducts.map((product) => (
							<ProductCardShop key={product.id} product={product} />
						))}
					</div>
				) : (
					/* Empty State */
					<div className="py-20 text-center">
						<p className="text-xl text-gray-500">No encontramos ninguna plantita que coincida con "{searchQuery}"</p>
						<button
							onClick={() => window.location.href = '/tienda'}
							className="mt-4 text-[#5B823B] font-bold underline"
						>
							Ver toda la colección
						</button>
					</div>
				)}

				{/* Paginación */}
				<div className="mt-16 flex justify-center items-center gap-2">
					<button className="p-2 text-gray-400 hover:text-[#5B823B]"> &lt; </button>

					{[1, 2, 3].map((num) => (
						<button
							key={num}
							className={`w-10 h-10 rounded-lg font-bold transition-colors ${num === 1 ? 'bg-[#5B823B] text-white' : 'text-gray-500 hover:bg-[#5B823B]/20'
								}`}
						>
							{num}
						</button>
					))}

					<button className="p-2 text-gray-400 hover:text-[#5B823B]"> &gt; </button>
				</div>

			</div>
		</div>
	);
};

export default TiendaPage;