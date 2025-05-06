'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';
import { ResetPasswordSchema, UserProfileSchema } from '@/Schemas/ProfileSchema';
import { useEffect, useState } from 'react';
import { safeParse } from 'valibot';
import useUpdateProfile from './useUpdateProfile';
import useUpdatePassword from './useUpdatePassword';
import { useQueryState } from 'nuqs';
import CampusSelect from './_components/CampusSelect';
import ProcessSelect from './_components/ProcessSelect';
import useEmployeeServices from './_components/useEmployeeServices';
import QueryRenderer from '@/components/QueryRenderer';
import ServiceManager from './_components/ServiceManager';
import { Service } from '@/types/service';
import useServices from '../servicios/useServices';
import useRequestProfileChange from './useRequestProfileChange';

function Profile() {
  const [tab, setTab] = useQueryState('tab', {
    defaultValue: 'informacion-personal',
    parse: (value) => value,
    serialize: (value) => value,
  });

  return (
    <main className="mx-auto w-full px-4 py-8">
      <h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
        Perfil
      </h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex flex-row justify-start gap-4 md:flex-col md:w-1/4">
          <Button
            variant={tab === 'informacion-personal' ? 'default' : 'ghost'}
            className='w-full'
            onClick={() => setTab('informacion-personal')}
          >
            Información personal
          </Button>
          <Button
            variant={tab === 'cambiar-contrasena' ? 'default' : 'ghost'}
            className='w-full'
            onClick={() => setTab('cambiar-contrasena')}
          >
            Cambiar contraseña
          </Button>
          <Button
            variant={tab === 'solicitud-cambios' ? 'default' : 'ghost'}
            className='w-full'
            onClick={() => setTab('solicitud-cambios')}
          >
            Peticiones de cambio de perfil
          </Button>
        </nav>

        <div className="md:w-3/4">
          {tab === 'informacion-personal' && <PersonalInformation />}
          {tab === 'cambiar-contrasena' && <ChangePassword />}
          {tab === 'solicitud-cambios' && <ProfileChangeRequests />}
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
    if (result.success) {
      updateMutation.mutate();
    }
  }
  return (
    <section className="rounded-lg bg-white p-4 sm:p-6 shadow-sm border border-gray-200">
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
    const result = safeParse(ResetPasswordSchema, {
      password: newPassword,
      confirm_password: confirmPassword,
      current_password: currentPassword,
    });
    if (result.success) {
      mutation.mutate();
    }
  }

  return (
    <section className="rounded-lg bg-white p-4 sm:p-6 shadow-sm border border-gray-200">
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

function ProfileChangeRequests() {
  const { user } = useAuth({ middleware: 'auth' });
  const employeeQuery = useEmployeeServices(user?.employee_id ?? undefined);
  const {
    data: allServices,
  } = useServices(
    { deleted_at: 'null', process_id: employeeQuery.data?.process_id ?? 0 },
  );

  const [requestType, setRequestType] = useState<'campus' | 'process' | 'service' | null>(null);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('');
  const [managedServices, setManagedServices] = useState<Service[]>([]);

  const requestProfileChangeMutation = useRequestProfileChange(user?.employee_id ?? undefined);

  // Show different content for national coordinators
  if (user?.role === 'national_coordinator') {
    return (
      <section className="rounded-lg bg-white p-4 sm:p-6 shadow-sm border border-gray-200">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Peticiones de cambio de perfil
        </h2>
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">
            Como coordinador nacional, no necesitas solicitar cambios de perfil.
          </p>
          <p className="text-gray-500">
            Tu rol te permite gestionar y aprobar las solicitudes de cambio de otros usuarios.
          </p>
        </div>
      </section>
    );
  }

  useEffect(() => {
    if (employeeQuery.data?.services) {
      setManagedServices(employeeQuery.data.services);
    }
  }, [employeeQuery.data]);

  const handleSubmit = () => {
    if (requestType === 'campus') {
      requestProfileChangeMutation.mutateAsync({
        change_type: 'campus',
        new_value: [Number(selectedCampus)]
      });
    }
    if (requestType === 'process') {
      requestProfileChangeMutation.mutateAsync({
        change_type: 'process',
        new_value: [Number(selectedProcess)]
      });
    }
    if (requestType === 'service') {
      requestProfileChangeMutation.mutateAsync({
        change_type: 'service',
        new_value: managedServices.map(service => service.id)
      });
    }
  }

return (
  <section className="rounded-lg bg-white p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Peticiones de cambio de perfil
      </h2>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Button
            variant={requestType === 'campus' ? 'default' : 'outline'}
            onClick={() => setRequestType('campus')}
            className="flex-1 min-w-[200px]"
          >
            Cambiar seccional
          </Button>
          <Button
            variant={requestType === 'process' ? 'default' : 'outline'}
            onClick={() => setRequestType('process')}
            className="flex-1 min-w-[200px]"
          >
            Cambiar proceso
          </Button>
          <Button
            variant={requestType === 'service' ? 'default' : 'outline'}
            onClick={() => setRequestType('service')}
            className="flex-1 min-w-[200px]"
          >
            Cambiar servicio
          </Button>
        </div>

        {requestType && (
          <div className="space-y-4">
            {requestType === 'campus' && (
              <div>
                <Label>Seleccionar nueva seccional</Label>
                <CampusSelect
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e)}
                />
              </div>
            )}

            {requestType === 'process' && (
              <div>
                <Label>Seleccionar nuevo proceso</Label>
                <ProcessSelect
                  value={selectedProcess}
                  onChange={(e) => setSelectedProcess(e)}
                />
              </div>
            )}

            {requestType === 'service' && (
              <div>
                <Label>Gestionar servicios</Label>
                <QueryRenderer
                  query={employeeQuery}
                  config={{
                    pending: () => <div>Cargando servicios...</div>,
                    error: () => <div>Error cargando servicios</div>,
                    empty: () => <div>No hay servicios disponibles</div>,
                    success: () => (
                      <ServiceManager
                        allServices={allServices ?? []}
                        initialServices={managedServices}
                        onChange={setManagedServices}
                      />
                    ),
                  }}
                />
              </div>
            )}
            <Button onClick={handleSubmit} disabled={requestProfileChangeMutation.isPending} className="w-full">Enviar solicitud</Button>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Solicitudes pendientes</h3>
          <div className="space-y-4">
            {/* Aquí irá la lista de solicitudes realizadas */}
            <div className="p-4 border rounded-lg">
              <p className="font-medium">No hay solicitudes pendientes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
