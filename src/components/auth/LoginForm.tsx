// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';
import { login, setToken } from '@/lib/auth';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login({ email: identifier, password });
      setToken(data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('user-login'));
      toast.success(data.user.first_name ? `¡Bienvenido de nuevo, ${data.user.first_name}!` : '¡Bienvenido de nuevo!');
      window.location.href = '/account';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full space-y-6" onSubmit={handleLogin}>
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
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
      </div>

      <div className="relative">
        <label className="text-sm font-semibold text-planthia-dark mb-1.5 block">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full px-5 py-4 bg-planthia-cream border border-transparent rounded-xl focus:outline-none focus:border-planthia-green focus:bg-white transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            // Fuera del orden de Tab: así Tab pasa al campo siguiente
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-planthia-dark/20 hover:text-planthia-green transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-planthia-green hover:text-planthia-green/70 transition-colors font-medium"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-lg w-full mt-4"
      >
        {loading ? 'Iniciando sesión...' : 'Entrar'}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}