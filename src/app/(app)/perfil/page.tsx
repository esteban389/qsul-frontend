'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';
import { ResetPasswordSchema, UserProfileSchema } from '@/Schemas/ProfileSchema';
import { useState } from 'react';
import { safeParse } from 'valibot';
import useUpdateProfile from './useUpdateProfile';
import useUpdatePassword from './useUpdatePassword';

function Profile() {
  const [view, setView] = useState('personal-information');
  return (
    <main className="mx-auto w-full px-4 py-8">
      <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
        Perfil
      </h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex flex-row justify-start gap-4 md:flex-col md:w-1/4">
          <Button
            variant={view === 'personal-information' ? 'default' : 'ghost'}
            className='w-full'
            onClick={() => setView('personal-information')}
          >
            Información personal
          </Button>
          <Button
            variant={view === 'change-password' ? 'default' : 'ghost'}
            className='w-full'
            onClick={() => setView('change-password')}
          >
            Cambiar contraseña
          </Button>
        </nav>

        <div className="md:w-3/4">
          {view === 'personal-information' && <PersonalInformation />}
          {view === 'change-password' && <ChangePassword />}
        </div>
      </div>
    </main>
  );
}

function PersonalInformation() {
  const { user } = useAuth({ middleware: 'auth' });
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState<File | string>(user?.avatar || '');
  const updateMutation = useUpdateProfile({
    email,
    name,
    avatar: typeof avatar === 'string' ? null : avatar,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = safeParse(UserProfileSchema, {
      avatar,
      email,
      name,
    });
    if(result.success){
      updateMutation.mutate();
    }
  }
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Información personal
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-lg text-gray-700">
          <Label className="block mb-2" htmlFor="avatar">
            Avatar
          </Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || '')}
            className="w-full"
          />
        </div>
        <div className="text-lg text-gray-700">
          <Label className="block mb-2" htmlFor="name">
            Nombre
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full"
          />
        </div>
        <div className="text-lg text-gray-700">
          <Label className="block mb-2" htmlFor="email">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full"
          />
        </div>
        <Button className="w-full mt-4" type="submit" disabled={updateMutation.isPending}>
          Actualizar información
        </Button>
      </form>
    </section>
  )
}

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const mutation = useUpdatePassword({
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: confirmPassword,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = safeParse(ResetPasswordSchema,{
      password: newPassword,
      confirm_password: confirmPassword,
      current_password: currentPassword,
    });
    if(result.success){
      mutation.mutate();
    }
  }

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Cambiar contraseña
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Contraseña actual"
          className="w-full"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirmar nueva contraseña"
          className="w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button disabled={mutation.isPending} className="w-full mt-2">Actualizar contraseña</Button>
      </form>
    </section>
  )
}

export default Profile;
