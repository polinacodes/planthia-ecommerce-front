// app/forgot-password/page.tsx
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-planthia-green/10 p-4 rounded-full mb-4">
            <Mail className="w-10 h-10 text-planthia-green" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-headline font-extrabold mb-2">Recuperar contraseña</h1>
          <p className="text-planthia-dark/60 font-body text-lg">
            Ingresá tu email y te enviaremos un código para restablecerla.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}