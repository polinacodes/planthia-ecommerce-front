// components/auth/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { forgotPassword } from '@/lib/auth';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Código enviado a tu email');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8 space-y-6">
        <CheckCircle className="w-16 h-16 text-planthia-green mx-auto" strokeWidth={1.5} />
        <div>
          <h2 className="text-xl font-headline font-bold mb-2">¡Email enviado!</h2>
          <p className="text-planthia-dark/60">
            Te enviamos un código a <strong>{email}</strong>.
          </p>
          <p className="text-planthia-dark/40 text-sm mt-2">
            Revisá tu bandeja de entrada y seguí las instrucciones.
          </p>
        </div>
        <p className="text-xs text-planthia-dark/40">
          ¿No lo recibiste? Revisá spam o{' '}
          <button
            onClick={() => {
              setSent(false);
              handleSubmit(new Event('submit') as any);
            }}
            className="text-planthia-green underline"
          >
            reenviar
          </button>
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6 w-full" onSubmit={handleSubmit}>
      <div className="relative">
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-planthia-dark/40 ml-4 mb-1.5 block">
          Correo Electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-planthia-dark/20" />
          <input
            type="email"
            required
            placeholder="tu@email.com"
            className="w-full pl-12 pr-4 py-4 bg-planthia-cream/20 border border-planthia-dark/5 rounded-2xl focus:outline-none focus:border-planthia-green transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center bg-planthia-dark text-white font-bold py-4 rounded-full hover:bg-planthia-dark/90 transition-all shadow-lg disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar código'}
        {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
      </button>
    </form>
  );
}