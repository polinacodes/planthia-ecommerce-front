import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId?: string;
  documentId?: string; // identificador fijo de Strapi 5 (el id numérico cambia al republicar)
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
  refreshStock: (products: any[]) => { soldOut: string[]; reduced: { name: string; stock: number }[] };
  totalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const MAX_LIMIT = 10;

/**
 * Id del ítem siempre como texto en minúsculas ("107", "107-naranja").
 * Antes unos lugares lo guardaban como número (107) y otros como texto ("107"), o con el color
 * en mayúscula: el carrito no los reconocía como el mismo producto y quedaban filas duplicadas.
 */
const normalizeId = (id: string | number) => String(id).trim().toLowerCase();

/** Junta ítems repetidos (carritos guardados antes del arreglo) sumando cantidades */
function mergeDuplicates(cart: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();
  for (const item of cart) {
    const id = normalizeId(item.id);
    const existing = merged.get(id);
    if (existing) {
      const limit = Math.min(MAX_LIMIT, existing.stock || MAX_LIMIT);
      existing.quantity = Math.min(existing.quantity + item.quantity, limit);
    } else {
      merged.set(id, { ...item, id });
    }
  }
  return [...merged.values()];
}

/**
 * ¿Este ítem del carrito es de este producto? (con cualquiera de sus colores)
 * Antes se usaba startsWith(id), y el producto 1 "encontraba" al 12, al 13...
 */
export function isCartItemOfProduct(
  item: { id: string | number; documentId?: string },
  product: { id: string | number; documentId?: string }
) {
  if (item.documentId && product.documentId) return item.documentId === product.documentId;
  const itemId = String(item.id);
  const productId = String(product.id);
  return itemId === productId || itemId.startsWith(`${productId}-`);
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,

      addItem: (rawItem) => {
        const newItem = { ...rawItem, id: normalizeId(rawItem.id) };
        const existingItem = get().cart.find((item) => normalizeId(item.id) === newItem.id);

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
              normalizeId(item.id) === newItem.id
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
          const item = state.cart.find((i) => normalizeId(i.id) === normalizeId(id));
          if (!item) return state;

          const validatedQuantity = Math.min(Math.max(1, quantity), item.stock || 0);

          return {
            cart: state.cart.map((i) =>
              normalizeId(i.id) === normalizeId(id) ? { ...i, quantity: validatedQuantity } : i
            ),
          };
        });
      },

      removeItem: (id) => set((state) => ({ cart: state.cart.filter((i) => normalizeId(i.id) !== normalizeId(id)) })),
      clearCart: () => set({ cart: [] }),

      // Actualiza stock y precio de cada ítem con los datos actuales de Strapi.
      // Si el stock bajó, ajusta la cantidad; si se agotó, deja el ítem con stock 0
      // para que el carrito lo muestre "Sin stock" y no deje avanzar.
      refreshStock: (products) => {
        const soldOut: string[] = [];
        const reduced: { name: string; stock: number }[] = [];

        const cart = get().cart.map((item) => {
          const product = products.find((p) => isCartItemOfProduct(item, p));
          if (!product) {
            // Sin documentId (carritos viejos) no se puede verificar: se deja como está
            if (!item.documentId) return item;
            soldOut.push(item.name);
            return { ...item, stock: 0 };
          }

          let stock = Number(product.stock) || 0;
          if (item.color && Array.isArray(product.variants) && product.variants.length > 0) {
            const variant = product.variants.find(
              (v: any) => String(v.color).toLowerCase() === item.color!.toLowerCase()
            );
            stock = Number(variant?.stock) || 0;
          }

          const quantity = stock > 0 ? Math.min(item.quantity, stock) : item.quantity;
          if (stock <= 0) soldOut.push(item.name);
          else if (quantity < item.quantity) reduced.push({ name: item.name, stock });

          return { ...item, stock, quantity, price: Number(product.price) || item.price };
        });

        set({ cart });
        return { soldOut, reduced };
      },
      totalItems: () => get().cart.reduce((acc, item) => acc + item.quantity, 0),
      getTotalPrice: () => get().cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'planthia-cart-storage',
      // Al cargar un carrito guardado, junta los ítems repetidos
      merge: (persisted, current) => {
        const saved = (persisted as Partial<CartStore>) ?? {};
        return { ...current, ...saved, cart: mergeDuplicates(saved.cart ?? []) };
      },
    }
  )
);