'use client';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { LockKeyhole, Wallet, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// INTERFACES
interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip_code?: string;
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
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'paypal'>('paypal');
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip_code: ''
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
      case 'first_name': return !value.trim() ? 'El nombre es obligatorio' : undefined;
      case 'last_name': return !value.trim() ? 'El apellido es obligatorio' : undefined;
      case 'email': return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Email inválido' : undefined;
      case 'phone': return !value.trim() ? 'El teléfono es obligatorio' : undefined;
      case 'address': return !value.trim() ? 'La dirección es obligatoria' : undefined;
      case 'city': return !value.trim() ? 'La ciudad es obligatoria' : undefined;
      case 'zip_code': return !/^\d{4,5}$/.test(value.trim()) ? 'CP inválido' : undefined;
      default: return undefined;
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
        const calculatedDiscount = (subtotal * data.discountAmount) / 100;

        setDiscountAmount(calculatedDiscount); 
        setDiscountError('');

        toast.success('¡Código aplicado!', {
          description: `Se ha aplicado un ${data.discountAmount}% de descuento (-$${calculatedDiscount.toFixed(2)})`,
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
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip_code: formData.zip_code,
          cart: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, productId: item.id })),
          payment_method: paymentMethod,
          subtotal: subtotal,
          shipping_cost: shippingCost,
          discount_code: discountAmount > 0 ? discountCode : null,
          discount_amount: discountAmount,
          total: total,
        }),
      });

      const data = await res.json();

      if (data.ok) {

        if (paymentMethod === 'mercadopago' && data.mercadoPagoUrl) {
          window.open(data.mercadoPagoUrl, '_blank');
          router.push(`/payment-waiting?orderId=${data.orderId}`);
          return;
        }

        if (paymentMethod === 'paypal' && data.paypalUrl) {
          window.location.href = data.paypalUrl;
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
            onClick={() => router.push('/shop')}
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
                  <InputField
                    label="Nombre"
                    placeholder="Ana"
                    value={formData.first_name}
                    onChange={(val) => updateField('first_name', val)}
                    onBlur={() => handleBlur('first_name')}
                    error={touchedFields.has('first_name') ? formErrors.first_name : undefined}
                  />
                  <InputField
                    label="Apellido"
                    placeholder="García"
                    value={formData.last_name}
                    onChange={(val) => updateField('last_name', val)}
                    onBlur={() => handleBlur('last_name')}
                    error={touchedFields.has('last_name') ? formErrors.last_name : undefined}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Email"
                    placeholder="ana@ejemplo.com"
                    type="email"
                    value={formData.email}
                    onChange={(val) => updateField('email', val)}
                    onBlur={() => handleBlur('email')}
                    error={touchedFields.has('email') ? formErrors.email : undefined}
                  />
                  <InputField
                    label="Teléfono"
                    placeholder="11 1234 5678"
                    value={formData.phone}
                    onChange={(val) => updateField('phone', val)}
                    onBlur={() => handleBlur('phone')}
                    error={touchedFields.has('phone') ? formErrors.phone : undefined}
                  />
                </div>
                <InputField
                  label="Dirección"
                  placeholder="Calle de las Flores 123"
                  value={formData.address}
                  onChange={(val) => updateField('address', val)}
                  onBlur={() => handleBlur('address')}
                  error={touchedFields.has('address') ? formErrors.address : undefined}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Ciudad"
                    placeholder="Buenos Aires"
                    value={formData.city}
                    onChange={(val) => updateField('city', val)}
                    onBlur={() => handleBlur('city')}
                    error={touchedFields.has('city') ? formErrors.city : undefined}
                  />
                  <InputField
                    label="Código Postal"
                    placeholder="1234"
                    value={formData.zip_code}
                    onChange={(val) => updateField('zip_code', val)}
                    onBlur={() => handleBlur('zip_code')}
                    error={touchedFields.has('zip_code') ? formErrors.zip_code : undefined}
                  />
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
                <PaymentOption label="PayPal" description="Tarjetas de crédito internacionales" icon={<img src="/icons/paypal.svg" alt="PayPal" className="w-30 h-30 object-contain" />} selected={paymentMethod === 'paypal'} onSelect={() => setPaymentMethod('paypal')} />
                <PaymentOption label="Mercado Pago" description="Paga con saldo o tarjeta local" icon={<img src="/icons/mercadopago.svg" alt="Mercado Pago" className="w-30 h-30 object-contain" />} selected={paymentMethod === 'mercadopago'} onSelect={() => setPaymentMethod('mercadopago')} />
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
                {discountAmount > 0 && (
                  <div className="flex justify-between text-planthia-green">
                    <span>Descuento</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-planthia-dark/70">
                  <span>Envío</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
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