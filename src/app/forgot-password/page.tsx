// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { forgotPassword } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10 text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-planthia-green mx-auto" strokeWidth={1.5} />
          <div>
            <h2 className="text-3xl font-headline font-bold mb-2">¡Email enviado!</h2>
            <p className="text-planthia-dark/60">
              Te enviamos un enlace a <strong>{email}</strong>.
            </p>
            {/* <p className="text-planthia-dark/40 mt-2">
              Revisá tu bandeja de entrada y seguí las instrucciones.
            </p> */}
          </div>
          <p className="text-xs text-planthia-dark/40">
            ¿No lo recibiste?{' '}
            <button onClick={() => setSent(false)} className="text-planthia-green underline">
              Reenviar
            </button>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-planthia-green/10 p-4 rounded-full mb-4">
            <Mail className="w-10 h-10 text-planthia-green" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-headline font-extrabold mb-2">Recuperar contraseña</h1>
          <p className="text-planthia-dark/60 font-body text-lg">
            Ingresá tu email y te ayudamos a restablecerla.
          </p>
        </div>

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
            className="w-full flex items-center justify-center bg-planthia-dark text-white font-bold py-4 hover:bg-planthia-dark/90 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      </div>
    </main>
  );
}