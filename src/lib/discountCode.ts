/**
 * Cupón que llega por link (por ejemplo, desde el mail de bienvenida:
 * planthia.vercel.app/?cupon=WELCOME10_XXXX). Se guarda en el navegador y el
 * checkout lo aplica solo, así no hay que copiarlo y pegarlo.
 */
const STORAGE_KEY = 'planthia_discount_code';

export const normalizeDiscountCode = (code: string) => code.trim().toUpperCase();

export function savePendingDiscountCode(code: string) {
  try {
    localStorage.setItem(STORAGE_KEY, normalizeDiscountCode(code));
  } catch {
    // Sin acceso a localStorage (modo privado estricto): se ingresa a mano
  }
}

export function getPendingDiscountCode(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearPendingDiscountCode() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nada que limpiar
  }
}
