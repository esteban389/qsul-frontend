import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import env from '@/lib/env';
import { cn } from '@/lib/utils';
import backendClient from '@/services/backendClient';
import { Process } from '@/types/process';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function page({
  params,
}: {
  params: { seccional: string };
}) {
  try {
    await backendClient.get(`/api/campuses/${params.seccional}`);
  } catch (error) {
    notFound();
  }
  const processses = (await backendClient.get<Process[]>('/api/processes'))
    .data;

  return (
    <div className="relative flex h-full flex-col gap-4">
      <Link
        href="/encuesta"
        className={cn(buttonVariants(), 'static left-0 top-0 md:absolute')}>
        <ChevronLeft />
      </Link>
      <h1 className="w-full text-center text-2xl font-bold">
        Selecciona el área
      </h1>
      <p className="text-center text-primary lg:text-primary/80">
        Elige el área que deseas evaluar
      </p>
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 p-2 lg:grid-cols-2">
          {processses.map(process => (
            <Link
              key={process.id}
              href={`/encuesta/${params.seccional}/${process.token}`}>
              <Card className="transition-all hover:scale-105 hover:shadow-2xl">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={env('API_URL') + process.icon}
                      alt={process.name}
                    />
                    <AvatarFallback>{process.name[0]}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{process.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
