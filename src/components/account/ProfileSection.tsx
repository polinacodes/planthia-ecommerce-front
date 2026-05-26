'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, Pencil, X } from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  zip_code: string | null;
}

interface ProfileSectionProps {
  user: UserData;
  onUserUpdate: (updatedUser: any) => void;
}

export default function ProfileSection({ user, onUserUpdate }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    zip_code: user.zip_code || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status !== 'idle') setStatus('idle');
  };

  const handleCancel = () => {
    
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      zip_code: user.zip_code || '',
    });
    setStatus('idle');
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:1337/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al actualizar el perfil');

      const updatedUser = await response.json();
      
      onUserUpdate(updatedUser);
      setStatus('success');
      setIsEditing(false); 
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-planthia-ice/60 backdrop-blur-md rounded-3xl p-8 border border-planthia-dark/5 shadow-sm animate-in fade-in duration-500">
      
      {/* Header de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline font-bold text-2xl text-planthia-dark">
            Información Personal
          </h2>
          <p className="text-sm text-planthia-dark/60 mt-1">
            {isEditing 
              ? "Modifica tus datos de contacto y facturación." 
              : ""}
          </p>
        </div>

        {/* Botón Editar  */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-planthia-cream border border-planthia-dark/10 rounded-xl font-bold text-sm text-planthia-dark hover:bg-planthia-dark/5 transition-colors cursor-pointer self-start sm:self-center shadow-sm"
          >
            <Pencil size={14} />
            Editar datos
          </button>
        )}
      </div>

      {status === 'success' && (
        <div className="p-4 mb-6 rounded-xl bg-planthia-light-green/10 text-planthia-green text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle size={18} />
          ¡Tus datos han sido guardados correctamente!
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 mb-6 rounded-xl bg-red-50 text-red-600 text-sm font-bold animate-in fade-in">
          Hubo un problema al guardar los cambios. Inténtalo de nuevo.
        </div>
      )}

      {/* --- MODO LECTURA --- */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in duration-300">
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/40 mb-1">Usuario</span>
            <p className="text-sm font-medium text-planthia-dark/80 py-2 border-b border-planthia-dark/5">{user.username}</p>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/40 mb-1">Email</span>
            <p className="text-sm font-medium text-planthia-dark/80 py-2 border-b border-planthia-dark/5">{user.email}</p>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/40 mb-1">Nombre</span>
            <p className="text-sm font-medium text-planthia-dark py-2 border-b border-planthia-dark/5">{user.first_name || '—'}</p>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/40 mb-1">Apellido</span>
            <p className="text-sm font-medium text-planthia-dark py-2 border-b border-planthia-dark/5">{user.last_name || '—'}</p>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/40 mb-1">Teléfono</span>
            <p className="text-sm font-medium text-planthia-dark py-2 border-b border-planthia-dark/5">{user.phone || '—'}</p>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/40 mb-1">Dirección</span>
            <p className="text-sm font-medium text-planthia-dark py-2 border-b border-planthia-dark/5">{user.address || '—'}</p>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/40 mb-1">Ciudad</span>
            <p className="text-sm font-medium text-planthia-dark py-2 border-b border-planthia-dark/5">{user.city || '—'}</p>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/40 mb-1">Código Postal</span>
            <p className="text-sm font-medium text-planthia-dark py-2 border-b border-planthia-dark/5">{user.zip_code || '—'}</p>
          </div>
        </div>
      ) : (
        /* --- MODO EDICIÓN (FORMULARIO) --- */
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/60 mb-2">Nombre</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full px-5 py-4 rounded-xl bg-white text-planthia-dark text-sm border border-planthia-dark/10 focus:border-planthia-green focus:ring-1 focus:ring-planthia-green outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/60 mb-2">Apellido</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Tu apellido"
                className="w-full px-5 py-4 rounded-xl bg-white text-planthia-dark text-sm border border-planthia-dark/10 focus:border-planthia-green focus:ring-1 focus:ring-planthia-green outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/60 mb-2">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: +34 600 000 000"
                className="w-full px-5 py-4 rounded-xl bg-white text-planthia-dark text-sm border border-planthia-dark/10 focus:border-planthia-green focus:ring-1 focus:ring-planthia-green outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/60 mb-2">Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Calle, número, piso..."
                className="w-full px-5 py-4 rounded-xl bg-white text-planthia-dark text-sm border border-planthia-dark/10 focus:border-planthia-green focus:ring-1 focus:ring-planthia-green outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/60 mb-2">Ciudad</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Tu ciudad"
                className="w-full px-5 py-4 rounded-xl bg-white text-planthia-dark text-sm border border-planthia-dark/10 focus:border-planthia-green focus:ring-1 focus:ring-planthia-green outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-planthia-dark/60 mb-2">Código Postal</label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="Ej: 28001"
                className="w-full px-5 py-4 rounded-xl bg-white text-planthia-dark text-sm border border-planthia-dark/10 focus:border-planthia-green focus:ring-1 focus:ring-planthia-green outline-none transition-all"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-center sm:justify-end gap-3 sm:gap-4 pt-4 border-t border-planthia-dark/5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none justify-center px-4 sm:px-6 py-4 border border-planthia-dark/10 bg-planthia-cream text-planthia-dark rounded-xl font-bold text-sm hover:bg-planthia-dark/5 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <X size={16} />
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none justify-center px-5 sm:px-8 py-3 bg-planthia-green text-planthia-ice rounded-xl font-bold text-sm hover:bg-planthia-light-green transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span>Guardando...</span>
                  <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}