'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import Image from 'next/image';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenNewsletter');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenNewsletter', 'true');
  };

  // Misma suscripción que el bloque de la home; al suscribirse, el popup se cierra a los 2 segundos
  const { email, setEmail, loading, handleSubmit } = useNewsletterSubscribe(() => setTimeout(() => closePopup(), 2000));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-planthia-dark/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-planthia-ice rounded-[2rem] overflow-hidden w-full flex flex-col md:flex-row relative shadow-2xl max-w-sm md:max-w-3xl xl:max-w-3xl 2xl:max-w-4xl"
          >
            <button
              onClick={closePopup}
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-planthia-ice/50 hover:bg-planthia-ice transition-colors"
            >
              <X size={20} className="text-planthia-dark" />
            </button>
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-auto bg-planthia-cream relative">
              <Image
                src="/2.webp"
                alt="Planthia"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 rounded-full bg-planthia-green/10 text-planthia-green-dark font-bold text-[10px] uppercase tracking-[0.2em] mb-4 self-start">
                #ComunidadPlanthia
              </span>
              <h2 className="text-4xl font-headline font-extrabold text-planthia-dark mb-3">
                Bienvenido a Planthia<span className="text-planthia-green">.</span>
              </h2>
              <p className="font-body text-planthia-dark/70 text-lg mb-6">
                Suscribite a nuestro newsletter y recibí un beneficio exclusivo.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-planthia-cream border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-planthia-green outline-none font-body"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {loading ? 'Enviando...' : 'Quiero mi regalo →'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}