'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Check, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [strength, setStrength] = useState(0);
  const [metRequirements, setMetRequirements] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const requirements = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[.*@!#%&()^~{}]+/.test(password)
    };
    setMetRequirements(requirements);

    const count = Object.values(requirements).filter(Boolean).length;
    setStrength((count / 4) * 100);
  }, [password]);

  const passwordValid = strength === 100;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid || !passwordsMatch) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          password: password,
          passwordConfirmation: confirmPassword,
        }),
      });

      if (res.ok) {
        toast.success('¡Contraseña configurada con éxito!');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const data = await res.json();
        toast.error(data.error?.message || 'Error al configurar la contraseña');
      }
    } catch (error) {
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10">

        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-planthia-green/10 p-4 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-planthia-green" strokeWidth={1.5} />
          </div>

          {/* <div className="bg-planthia-green/10 p-4 rounded-full mb-6">
           <Leaf className="w-12 h-12 text-planthia-green" strokeWidth={1.5} />
        </div> */}

          <h1 className="text-3xl font-headline font-extrabold mb-2">Bienvenido a Planthia</h1>
          <p className="text-planthia-dark/60 font-body text-lg">Estás a un paso de acceder a tu cuenta. <br /> Configurá tu nueva contraseña:</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Campo 1: Nueva Contraseña */}
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-planthia-dark/40 ml-4 mb-1.5 block">
              Nueva Contraseña
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-5 py-4 bg-planthia-cream/20 border rounded-xl focus:outline-none transition-all ${passwordValid ? 'border-planthia-green/50' : 'border-planthia-dark/5'}`}
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
              <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${passwordValid ? 'bg-planthia-green scale-100' : 'bg-gray-100 scale-75 opacity-0'}`}>
                <Check size={14} className="text-white" strokeWidth={4} />
              </div>
            </div>
          </div>

          {/* Campo 2: Confirmar Contraseña */}
          <div className="relative">
            <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-planthia-dark/40 ml-4 mb-1.5 block">
              Confirmar Contraseña
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-5 py-4 bg-planthia-cream/20 border rounded-xl focus:outline-none transition-all ${passwordsMatch ? 'border-planthia-green/50' : 'border-planthia-dark/5'}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-planthia-dark/20 hover:text-planthia-green transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${passwordsMatch ? 'bg-planthia-light-green scale-100' : 'bg-gray-100 scale-75 opacity-0'}`}>
                <Check size={14} className="text-white" strokeWidth={4} />
              </div>
            </div>

            {/* Sección de Seguridad barra */}
            <div className="mt-5 px-1">
              {/* Barra de progreso */}
              <div className="flex justify-end mb-2">
                <span className={`text-[10px] font-bold transition-colors ${strength === 100 ? 'text-planthia-light-green' : 'text-yellow-500'}`}>
                  {strength}%
                </span>
              </div>

              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${strength === 100 ? 'bg-planthia-light-green' : 'bg-yellow-400'}`}
                  style={{ width: `${strength}%` }}
                />
              </div>

              <p className="mt-3 text-[10px] text-planthia-dark/40 italic leading-relaxed w-full text-center">
                Incluí 8+ caracteres, y al menos 1 mayúscula, número y símbolo (.*@!#)
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
      </div>
    </main>
  );
}