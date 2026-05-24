'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-planthia-dark/20 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-planthia-ice rounded-[2rem] overflow-hidden max-w-md w-full p-8 md:p-10 relative shadow-2xl border border-white/20 text-center"
          >
            {/* Botón Cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-planthia-ice/50 hover:bg-planthia-cream transition-colors"
            >
              <X size={20} className="text-planthia-dark" />
            </button>

            {/* Contenido */}
            <div className="flex flex-col items-center mt-4">
              <h2 className="text-3xl font-headline font-extrabold text-planthia-dark mb-3">
                ¡Hola!
              </h2>

              <p className="font-body text-planthia-dark/70 text-lg mb-8 max-w-xs mx-auto">
                Para poder guardar tus plantas favoritas, Ingresa a tu cuenta 
              </p>

              {/* Acciones */}
              <div className="w-full space-y-3">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block w-full bg-planthia-green text-white font-headline font-bold py-3 px-6 rounded-full hover:bg-planthia-dark transition-colors text-sm uppercase tracking-wider text-center shadow-md"
                >
                  Ingresar
                </Link>

                <Link
                  href="/register"
                  onClick={onClose}
                  className="block w-full bg-transparent text-planthia-dark border border-planthia-dark/20 font-headline font-bold py-3 px-6 rounded-full hover:bg-planthia-cream/50 transition-colors text-sm uppercase tracking-wider text-center"
                >
                  Crear cuenta
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}