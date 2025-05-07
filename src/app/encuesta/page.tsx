import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import env from '@/lib/env';
import internalBackendClient from '@/services/internalBackendClient';
import { Campus } from '@/types/campus';
import Link from 'next/link';

export default async function page() {
  const campuses = (await internalBackendClient.get<Campus[]>('/api/campuses')).data;
  return (
    <div className="flex h-full flex-col gap-4">
      <h1 className="w-full text-center text-2xl font-bold">
        Selecciona tu seccional
      </h1>
      <p className="text-center text-primary lg:text-primary/80">
        Elige una de las seccionales de la universidad para continuar con el
        proceso
      </p>
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {campuses.map(campus => (
            <Link key={campus.id} href={`/encuesta/${campus.token}`}>
              <Card className="transition-all hover:scale-105 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={env('API_URL') + campus.icon}
                      alt={campus.name}
                    />
                    <AvatarFallback>{campus.name[0]}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{campus.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
