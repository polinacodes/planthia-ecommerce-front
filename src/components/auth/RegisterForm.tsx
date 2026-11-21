'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Mail, User } from 'lucide-react';
import { register, setToken } from '@/lib/auth';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await register({ username, email, password });
      
      setToken(data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Igual que en el login: avisa al resto del sitio (favoritos, menú) que hay sesión
      window.dispatchEvent(new Event('user-login'));
      
      toast.success('¡Cuenta creada con éxito!');
      router.push('/account');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit}>
      <div className="relative">
        <label className="text-sm font-semibold text-planthia-dark mb-1.5 block">
          Nombre
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-planthia-dark/20" />
          <input
            type="text"
            required
            placeholder="Tu nombre"
            className="w-full pl-12 pr-4 py-4 bg-planthia-cream border border-transparent rounded-xl focus:outline-none focus:border-planthia-green focus:bg-white transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-planthia-dark/20 hover:text-planthia-green cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-lg w-full mt-4"
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}