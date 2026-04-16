'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { X, Trash2, Plus, Minus } from 'lucide-react';

export const CartDrawer = () => {
  const { cart, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay  */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />

          {/* Panel Lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-planthia-cream shadow-2xl z-[101] p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-planthia-dark">Tu Carrito</h2>
              <button onClick={closeCart} className="hover:rotate-90 transition-transform duration-300 cursor-pointer">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <p className="text-[10px] uppercase tracking-widest font-medium">El carrito está vacío</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-5 mb-8 items-start border-b border-planthia-dark/5 pb-6">
                    <div className="w-24 h-24 flex items-center justify-center p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider leading-tight">{item.name}</h3>
                        {item.color && (
                          <span className="text-[9px] uppercase tracking-tighter opacity-50">
                            Color: {item.color}
                          </span>
                        )}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-planthia-dark/40 hover:text-red-800 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </div>

                      <p className="text-[11px] font-medium text-planthia-dark/60">${item.price}</p>

                      {/* Selector de cantidad */}
                      <div className="flex items-center border border-planthia-dark/10 w-fit mt-2 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-planthia-green transition-colors cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-[10px] font-bold px-3 min-w-[30px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-planthia-green transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-6 border-t border-planthia-dark/10">
              <div className="flex justify-between mb-4">
                <span className="text-xs font-bold uppercase">Total</span>
                <span className="text-xs font-bold">${getTotalPrice()}</span>
              </div>
              <button className="w-full bg-planthia-green text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-planthia-green transition-colors cursor-pointer">
                Finalizar Compra
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};