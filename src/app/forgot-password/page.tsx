// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { forgotPassword } from '@/lib/auth';
import Logo from '@/components/layout/Logo';

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
      <main data-page-bg="auth" className="min-h-screen font-body text-planthia-dark flex items-center justify-center p-6 relative">
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
    <main data-page-bg="auth" className="min-h-screen font-body text-planthia-dark flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo symbolOnly className="w-12 h-12 mb-5" />
          <h1 className="text-3xl font-headline font-extrabold mb-2">Recuperar contraseña</h1>
          <p className="text-planthia-dark/60 font-body text-lg">
            Ingresá tu email y te ayudamos a restablecerla.
          </p>
        </div>

        <form className="space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="text-sm font-semibold text-planthia-dark mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-planthia-dark/20" />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full pl-12 pr-4 py-4 bg-planthia-cream border border-transparent rounded-xl focus:outline-none focus:border-planthia-green focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      </div>
    </main>
  );
}