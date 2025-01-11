import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getInitials } from '@/lib/utils';
import env from '@/lib/env';
import QueryRenderer from '@/components/QueryRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { Service } from '@/types/service';
import { Dispatch, SetStateAction } from 'react';
import useServices from './useServices';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ServiceSelect({
  service = null,
  setService,
}: {
  service: Service | null;
  setService: Dispatch<SetStateAction<Service | null>>;
}) {
  const servicesQuery = useServices({ deleted_at: 'null' });
  return (
    <QueryRenderer
      query={servicesQuery}
      config={{
        pending: LoadingService,
        error: Error,
        success: Success,
      }}
      successProps={{ service, setService }}
    />
  );
}

function Success({
  data: services,
  service,
  setService,
}: {
  data: Service[];
  service: Service | null;
  setService: Dispatch<SetStateAction<Service | null>>;
}) {
  return (
    <Select
      value={service?.id ? String(service.id) : ''}
      onValueChange={(value: string) =>
        setService(services.find(s => s.id === Number(value)) || null)
      }>
      <SelectTrigger className="bg-background h-fit max-w-[60%] md:w-fit">
        <SelectValue placeholder="Seleccionar servicio" />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        <SelectGroup>
          <SelectItem value={null as unknown as string}>
            <div className="flex flex-row items-center gap-4 truncate">
              Sin servicio
            </div>
          </SelectItem>
          {services.map(service => (
            <SelectItem key={service.id} value={String(service.id)}>
              <div className="flex flex-row items-center gap-4 truncate">
                <Avatar>
                  <AvatarImage
                    src={service.icon ? env('API_URL') + service.icon : undefined}
                  />
                  <AvatarFallback>{getInitials(service.name)}</AvatarFallback>
                </Avatar>
                {service.name}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function LoadingService() {
  return <Skeleton className="h-10 w-36" />;
}

function Error({ retry }: { retry: () => void }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-red-500">Error al cargar servicios</span>
      <Button onClick={retry} className="text-blue-500 underline">
        Reintentar
      </Button>
    </div>
  );
}
