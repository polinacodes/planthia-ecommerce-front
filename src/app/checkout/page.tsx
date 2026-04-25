'use client';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { LockKeyhole, Wallet, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// INTERFACES
interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
}

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

interface PaymentOptionProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

// COMPONENTES SECUNDARIOS

function InputField({ label, placeholder, type = "text", value, onChange, onBlur, error }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-planthia-dark/70 ml-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full px-4 py-3 bg-planthia-cream border-none rounded-xl focus:ring-2 focus:ring-planthia-green outline-none text-planthia-dark placeholder:text-planthia-dark/30 transition-all ${error ? 'ring-2 ring-red-500 bg-red-50' : ''
          }`}
      />
      {error && <p className="text-red-500 text-sm mt-1 field-error">{error}</p>}
    </div>
  );
}

function PaymentOption({ label, description, icon, selected, onSelect }: PaymentOptionProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col items-center justify-center p-8 bg-white border rounded-xl cursor-pointer transition-all ${selected ? 'border-planthia-green shadow-lg scale-[1.02]' : 'border-planthia-dark/10 hover:border-planthia-green/50 hover:shadow-md'
        }`}
    >
      <div className="absolute top-4 right-4">
        <div className={`w-4 h-4 rounded-full border-2 ${selected ? 'bg-planthia-green border-planthia-green' : 'border-gray-300'}`} />
      </div>
      <div className="scale-150 transition-transform">{icon}</div>
    </div>
  );
}


//  COMPONENTE PRINCIPAL
export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const router = useRouter();

  // Estados
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'stripe'>('mercadopago');
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set());
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [discountTouched, setDiscountTouched] = useState(false);

  const shippingCost = 12.50;
  const subtotal = getTotalPrice();
  const total = subtotal + shippingCost - discountAmount;

  // FUNCIONES DE VALIDACIÓN
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es obligatorio';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return undefined;
      case 'apellido':
        if (!value.trim()) return 'El apellido es obligatorio';
        if (value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres';
        return undefined;
      case 'email':
        if (!value.trim()) return 'El email es obligatorio';
        if (!validateEmail(value)) return 'Ingresá un email válido (ej: nombre@dominio.com)';
        return undefined;
      case 'telefono':
        if (!value.trim()) return 'El teléfono es obligatorio';
        if (!/^[\d\s\-\(\)\+]{8,20}$/.test(value.trim())) return 'Ingresá un número de teléfono válido';
        return undefined;
      case 'direccion':
        if (!value.trim()) return 'La dirección es obligatoria';
        if (value.trim().length < 5) return 'Ingresá una dirección completa';
        return undefined;
      case 'ciudad':
        if (!value.trim()) return 'La ciudad es obligatoria';
        return undefined;
      case 'codigoPostal':
        if (!value.trim()) return 'El código postal es obligatorio';
        if (!/^\d{4,5}$/.test(value.trim())) return 'Ingresá un código postal válido (4 o 5 dígitos)';
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAllFields = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  // HANDLERS
  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouchedFields(prev => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    if (error) {
      setFormErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const applyDiscount = async () => {
    setDiscountError('');
    if (!discountCode.trim()) {
      toast.error('Por favor, ingresá un código de descuento');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/validate-discount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscountAmount(data.discountAmount);
        setDiscountError('');
        toast.success('¡Código aplicado!', {
          description: `Se han descontado $${data.discountAmount.toFixed(2)} de tu total.`,
        });
      } else {
        setDiscountError(data.message || 'Código inválido');
        setDiscountAmount(0);
        toast.error(data.message || 'Código inválido');
      }
    } catch (error) {
      setDiscountError('Error al validar código');
      toast.error('Error al conectar con el servidor');
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountCode(e.target.value);
    if (discountError) {
      setDiscountError('');
    }
    setDiscountTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log borrar
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    console.log('🔍 STRAPI_URL desde env:', process.env.NEXT_PUBLIC_STRAPI_URL);
    console.log('🔍 Todas las variables:', process.env);

    const allFields = new Set(Object.keys(formData) as Array<keyof FormData>);
    setTouchedFields(allFields);

    const isValid = validateAllFields();
    if (!isValid) {
      const firstError = document.querySelector('.field-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          cart: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentMethod: paymentMethod,
          subtotal: subtotal,
          shippingCost: shippingCost,
          discountCode: discountAmount > 0 ? discountCode : null,
          discountAmount: discountAmount,
          total: total,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        if (paymentMethod === 'mercadopago' && data.mercadoPagoUrl) {
          const mpWindow = window.open(data.mercadoPagoUrl, '_blank');
          router.push(`/payment-waiting?orderId=${data.orderId}`);
          return;
        }

        toast.success('¡Pedido creado!');
        clearCart();
        router.push(`/payment-status?orderId=${data.orderId}&status=approved`);

      } else {
        toast.error('Error al procesar el pedido');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // RENDER CONDICIONAL (carrito vacío)
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-planthia-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <button
            onClick={() => router.push('/tienda')}
            className="bg-planthia-green text-white px-6 py-3 rounded-full"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    );
  }

  // RENDER PRINCIPAL
  return (
    <div className="min-h-screen bg-planthia-cream text-planthia-dark">
      <form onSubmit={handleSubmit}>
        <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Columna Izquierda: Formulario */}
          <div className="lg:col-span-7 space-y-12">
            {/* Información de Envío */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-planthia-light-green/20 flex items-center justify-center text-planthia-green font-bold">1</span>
                <h2 className="text-2xl font-bold font-headline tracking-tight">Información de Envío</h2>
              </div>
              <div className="bg-white p-8 rounded-2xl space-y-6 shadow-sm border border-planthia-dark/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Nombre" placeholder="Ana" value={formData.nombre} onChange={(val) => updateField('nombre', val)} onBlur={() => handleBlur('nombre')} error={touchedFields.has('nombre') ? formErrors.nombre : undefined} />
                  <InputField label="Apellido" placeholder="García" value={formData.apellido} onChange={(val) => updateField('apellido', val)} onBlur={() => handleBlur('apellido')} error={touchedFields.has('apellido') ? formErrors.apellido : undefined} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Email" placeholder="ana@ejemplo.com" type="email" value={formData.email} onChange={(val) => updateField('email', val)} onBlur={() => handleBlur('email')} error={touchedFields.has('email') ? formErrors.email : undefined} />
                  <InputField label="Teléfono" placeholder="11 1234 5678" value={formData.telefono} onChange={(val) => updateField('telefono', val)} onBlur={() => handleBlur('telefono')} error={touchedFields.has('telefono') ? formErrors.telefono : undefined} />
                </div>
                <InputField label="Dirección" placeholder="Calle de las Flores 123" value={formData.direccion} onChange={(val) => updateField('direccion', val)} onBlur={() => handleBlur('direccion')} error={touchedFields.has('direccion') ? formErrors.direccion : undefined} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Ciudad" placeholder="Buenos Aires" value={formData.ciudad} onChange={(val) => updateField('ciudad', val)} onBlur={() => handleBlur('ciudad')} error={touchedFields.has('ciudad') ? formErrors.ciudad : undefined} />
                  <InputField label="Código Postal" placeholder="1234" value={formData.codigoPostal} onChange={(val) => updateField('codigoPostal', val)} onBlur={() => handleBlur('codigoPostal')} error={touchedFields.has('codigoPostal') ? formErrors.codigoPostal : undefined} />
                </div>
              </div>
            </section>

            {/* Método de Pago */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-planthia-light-green/20 flex items-center justify-center text-planthia-green font-bold">2</span>
                <h2 className="text-2xl font-bold font-headline tracking-tight">Método de Pago</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentOption label="Mercado Pago" description="Paga con saldo o tarjeta local" icon={<img src="/icons/mercadopago.svg" alt="Mercado Pago" className="w-30 h-30 object-contain" />} selected={paymentMethod === 'mercadopago'} onSelect={() => setPaymentMethod('mercadopago')} />
                <PaymentOption label="Stripe" description="Tarjetas de crédito internacionales" icon={<img src="/icons/stripe.svg" alt="Stripe" className="w-30 h-30 object-contain" />} selected={paymentMethod === 'stripe'} onSelect={() => setPaymentMethod('stripe')} />
              </div>
            </section>
          </div>

          {/* Sidebar Resumen */}
          <aside className="lg:col-span-5 sticky top-8">
            <div className="bg-white p-8 rounded-2xl space-y-8 shadow-sm border border-planthia-dark/5">
              <h3 className="text-xl font-bold font-headline">Resumen del Pedido</h3>
              <div className="space-y-6 max-h-[410px] overflow-y-auto pr-2 pb-4 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-planthia-cream overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-planthia-dark/70">Cant: {item.quantity}</p>
                      <p className="text-planthia-green font-semibold mt-1">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-planthia-dark/10">
                <div className="flex justify-between text-planthia-dark/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-planthia-dark/10 pt-6">
                  <label className="text-sm font-semibold text-planthia-dark/70 block mb-2">¿Tenés un código de descuento?</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" placeholder="WELCOME10_XXXXXX" value={discountCode} onChange={handleDiscountChange} className="flex-1 px-4 py-3 bg-planthia-cream border-none rounded-xl focus:ring-2 focus:ring-planthia-green outline-none placeholder:text-planthia-dark/30" />
                    <button type="button" onClick={applyDiscount} className="px-4 sm:px-4 py-3 bg-planthia-green text-white rounded-xl font-bold hover:bg-planthia-light-green transition-all cursor-pointer">Aplicar</button>
                  </div>
                </div>
                <div className="flex justify-between text-planthia-dark/70">
                  <span>Envío</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-planthia-green">
                    <span>Descuento</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-planthia-green">${total.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 rounded-full bg-planthia-green text-white font-bold text-lg hover:bg-planthia-light-green transition-all shadow-lg disabled:opacity-50 cursor-pointer">
                {loading ? 'Procesando...' : 'Finalizar Compra'}
              </button>
              <p className="text-center text-xs text-planthia-dark/50 flex items-center justify-center gap-2">
                <LockKeyhole size={14} /> Pago seguro y encriptado
              </p>
            </div>
          </aside>
        </main>
      </form>
    </div>
  );
}