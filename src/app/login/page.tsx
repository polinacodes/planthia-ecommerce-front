'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Leaf, Mail } from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success(`¡Bienvenido de nuevo, ${data.user.username}!`);
        router.push('/');
      } else {
        toast.error('Credenciales incorrectas. Verificá tu correo y contraseña.');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10 flex flex-col items-center">

        {/* Logo/Icono */}
        <div className="bg-planthia-green/10 p-4 rounded-full mb-6">
          <Leaf className="w-12 h-12 text-planthia-green" strokeWidth={1.5} />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-headline font-extrabold mb-2">Ingresá a Planthia</h1>
          <p className="text-planthia-dark/60 text-base">
            Gestioná tus pedidos y cuidá tus plantas.
          </p>
        </div>

        <form className="w-full space-y-6" onSubmit={handleLogin}>

          {/* Email / Usuario */}
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
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-planthia-dark/40 ml-4 mb-1.5 block">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-planthia-cream/20 border border-planthia-dark/5 rounded-2xl focus:outline-none focus:border-planthia-green transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-planthia-dark/20 hover:text-planthia-green transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center bg-planthia-dark text-white font-bold py-4 rounded-full hover:bg-planthia-dark/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
          </button>

          <div className="text-center mt-6">
            <p className="text-xs text-planthia-dark/40">
              ¿No tenés cuenta? La creamos automáticamente con tu primera compra.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}