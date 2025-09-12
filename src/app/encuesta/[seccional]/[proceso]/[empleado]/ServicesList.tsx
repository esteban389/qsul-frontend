'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Service } from '@/types/service';
import { parseAsInteger, useQueryState } from 'nuqs';

export const EMPLOYEE_SERVICE_PARAM = 'employee_service';
export const SERVICE_PARAM = 'service';

export default function ServicesList({ services }: { services: Service[] }) {
  const [search, setSearch] = useState('');
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase()),
  );
  const [, setSelectedEmployeeService] = useQueryState<number>(
    EMPLOYEE_SERVICE_PARAM,
    parseAsInteger.withDefault(0),
  );

  const [, setSelectedService] = useQueryState<number>(
    SERVICE_PARAM,
    parseAsInteger.withDefault(0),
  );

  const onClick = (service: Service) => {
    if ('pivot' in service && service.pivot) {
      setSelectedEmployeeService(service.pivot.id);
    }
    setSelectedService(service.id);
  };

  return (
    <>
      <div className="relative w-full">
        <Input
          className="bg-background pr-10 transition-all focus:ring-2 focus:ring-primary/30"
          placeholder="Préstamo de libros"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Search className="pointer-events-none absolute inset-y-0 right-0 mr-2 h-full text-muted-foreground" />
      </div>
      <ScrollArea className="w-full">
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
          {filteredServices.map(service => (
            <Card
              key={service.id}
              onClick={() => onClick(service)}
              className="cursor-pointer transition-all hover:scale-105 hover:shadow-2xl">
              <CardHeader className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={env('API_URL') + service.icon}
                    alt={service.name}
                  />
                  <AvatarFallback>{service.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
