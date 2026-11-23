// src/app/shop/loading.tsx
// Se ve unos milisegundos mientras el servidor trae los productos.
// Ocupa toda la pantalla para que el footer no aparezca arriba y después "salte" para abajo.
export default function ShopLoading() {
  return <div data-page-bg="top" className="min-h-screen" aria-hidden="true" />;
}
