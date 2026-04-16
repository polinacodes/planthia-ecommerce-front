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
          set({
            cart: currentCart.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...newItem, quantity: 1 }] });
        }
      },

      updateQuantity: (id, quantity) => {
        set({
          cart: get().cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
          ).filter(item => item.quantity > 0)
        });
      },

      removeItem: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      clearCart: () => set({ cart: [] }),

      totalItems: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => get().cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'planthia-cart-storage',
    }
  )
);