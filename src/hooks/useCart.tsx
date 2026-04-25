import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  stock: number;
}

interface CartStore {
  cart: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,

      addItem: (newItem) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.id === newItem.id);

       if (existingItem) {
          const currentStock = existingItem.stock || 0;
          
          if (existingItem.quantity + 1 > currentStock) {
            console.warn(`Límite de stock alcanzado (${currentStock}) para ${existingItem.name}`);
            return; 
          }
          
          set({
            cart: currentCart.map((item) =>
              item.id === newItem.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ),
          });
        } else {
          const stockValue = newItem.stock || 0;
          
          if (stockValue === 0) {
            console.warn(`Producto sin stock: ${newItem.name}`);
            return; 
          }
          
          set({ 
            cart: [...currentCart, { ...newItem, quantity: 1, stock: stockValue }] 
          });
        }
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.cart.find((i) => i.id === id);
          if (!item) return state;

          const maxStock = item.stock || 0;
          
          const validatedQuantity = Math.min(Math.max(1, quantity), maxStock);

          if (maxStock === 0) {
            console.warn(`Producto sin stock definido: ${item.name}`);
            return state;
          }

          return {
            cart: state.cart.map((i) =>
              i.id === id ? { ...i, quantity: validatedQuantity } : i
            )
          };
        });
      },

      removeItem: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),
      clearCart: () => set({ cart: [] }),
      totalItems: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => get().cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    { name: 'planthia-cart-storage' }
  )
);