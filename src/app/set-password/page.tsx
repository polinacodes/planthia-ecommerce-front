import SetPasswordForm from '@/components/auth/SetPasswordForm';
import Logo from '@/components/layout/Logo';

export default async function SetPasswordPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ code?: string }> 
}) {
  const params = await searchParams;
  const code = params.code || null;

  return (
    <main className="min-h-screen bg-planthia-gradient font-body text-planthia-dark flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 md:p-12 z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo symbolOnly className="w-12 h-12 mb-5" />
          <h1 className="text-3xl font-headline font-extrabold mb-2">Bienvenido a Planthia</h1>
          <p className="text-planthia-dark/60 font-body text-lg">Configurá tu nueva contraseña:</p>
        </div>
        <SetPasswordForm code={code} />
      </div>
    </main>
  );
}