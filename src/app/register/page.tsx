import RegisterForm from '@/components/auth/RegisterForm';
import { Leaf } from 'lucide-react';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10 flex flex-col items-center">
        <div className="bg-planthia-green/10 p-4 rounded-full mb-6">
          <Leaf className="w-12 h-12 text-planthia-green" strokeWidth={1.5} />
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-headline font-extrabold mb-2">Crea tu cuenta</h1>
        </div>
        <RegisterForm />
        <div className="text-center mt-6">
          <p className="text-xs text-planthia-dark/40">
            ¿Ya tenés cuenta? <a href="/login" className="text-planthia-green underline">Iniciá sesión</a>
          </p>
        </div>
      </div>
    </main>
  );
}