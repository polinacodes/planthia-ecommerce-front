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
      {/* <div className="relative">
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-planthia-dark/40 ml-4 mb-1.5 block">
          Nombre de usuario
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-planthia-dark/20" />
          <input
            type="text"
            required
            placeholder="Tu nombre"
            className="w-full pl-12 pr-4 py-4 bg-planthia-cream/20 border border-planthia-dark/5 rounded-2xl focus:outline-none focus:border-planthia-green transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div> */}

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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-planthia-dark/20 hover:text-planthia-green cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 flex items-center justify-center uppercase bg-planthia-dark text-white font-bold py-4 hover:bg-planthia-dark/90 cursor-pointer transition-all shadow-lg disabled:opacity-50"
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
      </button>
    </form>
  );
}