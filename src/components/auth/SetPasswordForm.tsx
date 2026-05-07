// components/auth/SetPasswordForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
import { resetPassword, setToken } from '@/lib/auth';

export default function SetPasswordForm({ code }: { code: string | null }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const requirements = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[.*@!#%&()^~{}]+/.test(password),
    };
    const count = Object.values(requirements).filter(Boolean).length;
    setStrength((count / 4) * 100);
  }, [password]);

  const passwordValid = strength === 100;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid || !passwordsMatch || !code) return;

    setLoading(true);
    try {
      const data = await resetPassword({
        code,
        password,
        passwordConfirmation: confirmPassword,
      });

      // Guardar el token y redirigir
      setToken(data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('¡Contraseña configurada con éxito!');
      router.push('/account');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al configurar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!code) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-medium">Código inválido o faltante</p>
        <p className="text-sm text-planthia-dark/40 mt-2">
          Solicitá un nuevo enlace desde la página de login.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6 w-full" onSubmit={handleSubmit}>
      <div className="relative">
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-planthia-dark/40 ml-4 mb-1.5 block">
          Nueva Contraseña
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className={`w-full px-5 py-4 bg-planthia-cream/20 border rounded-xl focus:outline-none transition-all ${
                passwordValid ? 'border-planthia-green/50' : 'border-planthia-dark/5'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-planthia-dark/20 hover:text-planthia-green transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
              passwordValid ? 'bg-planthia-green scale-100' : 'bg-gray-100 scale-75 opacity-0'
            }`}
          >
            <Check size={14} className="text-white" strokeWidth={4} />
          </div>
        </div>
      </div>

      <div className="relative">
        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-planthia-dark/40 ml-4 mb-1.5 block">
          Confirmar Contraseña
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className={`w-full px-5 py-4 bg-planthia-cream/20 border rounded-xl focus:outline-none transition-all ${
                passwordsMatch ? 'border-planthia-green/50' : 'border-planthia-dark/5'
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetí la contraseña"
            />
          </div>
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
              passwordsMatch ? 'bg-planthia-green scale-100' : 'bg-gray-100 scale-75 opacity-0'
            }`}
          >
            <Check size={14} className="text-white" strokeWidth={4} />
          </div>
        </div>

        {/* Barra de fortaleza */}
        <div className="mt-5 px-1">
          <div className="flex justify-end mb-2">
            <span
              className={`text-[10px] font-bold transition-colors ${
                strength === 100 ? 'text-planthia-green' : 'text-yellow-500'
              }`}
            >
              {strength}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                strength === 100 ? 'bg-planthia-green' : 'bg-yellow-400'
              }`}
              style={{ width: `${strength}%` }}
            />
          </div>
          <p className="mt-3 text-[10px] text-planthia-dark/40 italic leading-relaxed text-center">
            Incluí 8+ caracteres, 1 mayúscula, número y símbolo (.*@!#)
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !passwordValid || !passwordsMatch}
        className="w-full mt-4 flex items-center justify-center bg-planthia-dark text-white font-bold py-4 rounded-full hover:bg-planthia-dark/90 transition-all shadow-lg disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
      >
        {loading ? 'Guardando...' : 'Establecer Contraseña'}
        {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
      </button>
    </form>
  );
}