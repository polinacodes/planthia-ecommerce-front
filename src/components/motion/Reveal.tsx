// src/components/motion/Reveal.tsx
// Animaciones de aparición (Framer Motion).
// - Reveal: el bloque sube unos píxeles y aparece cuando entra en pantalla (una sola vez).
// - RevealGroup + RevealItem: los hijos aparecen en cascada, uno atrás de otro.
// Si la persona tiene activado "reducir movimiento" en su sistema, se muestran sin animar.
'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
// Se dispara un poco antes de que el bloque llegue al borde de abajo de la pantalla
const VIEWPORT = { once: true, margin: '0px 0px -8% 0px' } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distancia desde la que sube (px) */
  y?: number;
}

export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const groupVariants = (stagger: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={groupVariants(stagger)}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
