import RegisterForm from '@/components/auth/RegisterForm';
import Logo from '@/components/layout/Logo';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10 flex flex-col items-center">
        <Logo symbolOnly className="w-12 h-12 mb-5" />
        <div className="text-center mb-10">
          <h1 className="text-3xl font-headline font-extrabold mb-2">Creá tu cuenta</h1>
        </div>
        <RegisterForm />
        <div className="text-center mt-6">
          <p className="text-sm text-planthia-dark/60">
            ¿Ya tenés cuenta? <a href="/login" className="text-planthia-green font-semibold hover:underline">Iniciá sesión</a>
          </p>
        </div>
      </div>
    </main>
  );
}