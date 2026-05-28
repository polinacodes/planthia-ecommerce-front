import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 font-body bg-planthia-cream text-planthia-dark">
      <h1 className="text-6xl font-headline font-extrabold text-planthia-green mb-4">404</h1>
      <p className="text-xl font-semibold mb-2">Página no encontrada</p>
      <p className="text-planthia-dark/60 mb-8">La página que buscás no existe o fue movida.</p>
      <Link
        href="/"
        className="bg-planthia-dark text-white font-bold py-3 px-8 rounded-full hover:bg-planthia-green transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}