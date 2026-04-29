import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

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
  addItem: (item: CartItem) => boolean; 
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const MAX_LIMIT = 10;

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,

      addItem: (newItem) => {
        const existingItem = get().cart.find((item) => item.id === newItem.id);

        if (existingItem) {
          if (existingItem.quantity >= MAX_LIMIT) {
            toast.error("Cantidad máxima permitida");
            return false;
          }

          if (existingItem.quantity + 1 > (existingItem.stock || 0)) {
            toast.error("Stock insuficiente");
            return false;
          }

          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }));
        } else {
          if ((newItem.stock || 0) <= 0) {
            toast.error("Producto sin stock");
            return false;
          }

          set((state) => ({
            cart: [...state.cart, { ...newItem, quantity: 1 }],
          }));
        }
        return true;
      },

      updateQuantity: (id, quantity) => {
        if (quantity > MAX_LIMIT) {
          toast.error("Cantidad máxima permitida");
          return;
        }

        set((state) => {
          const item = state.cart.find((i) => i.id === id);
          if (!item) return state;

          const validatedQuantity = Math.min(Math.max(1, quantity), item.stock || 0);

          return {
            cart: state.cart.map((i) =>
              i.id === id ? { ...i, quantity: validatedQuantity } : i
            ),
          };
        });
      },

      removeItem: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
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