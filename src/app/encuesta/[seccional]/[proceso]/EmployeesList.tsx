'use client';

import { Employee } from '@/types/employee';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import env from '@/lib/env';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EmployeesList({
  employees,
  seccional,
  proceso,
}: {
  employees: Employee[];
  seccional: string;
  proceso: string;
}) {
  const [search, setSearch] = useState('');
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="relative w-full">
        <Input
          className="bg-background pr-10 transition-all focus:ring-2 focus:ring-primary/30"
          placeholder="Armando Casas"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Search className="pointer-events-none absolute inset-y-0 right-0 mr-2 h-full text-muted-foreground" />
      </div>
      <ScrollArea>
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
          {filteredEmployees.map(employee => (
            <Link
              key={employee.id}
              href={`/encuesta/${seccional}/${proceso}/${employee.token}`}>
              <Card className="h-48 w-full transition-all hover:scale-105 hover:shadow-2xl">
                <CardHeader className="group flex flex-col items-center gap-2">
                  <Avatar className="size-24 overflow-visible rounded-lg">
                    <div className="relative isolate">
                      <div className="size-full overflow-hidden rounded-lg">
                        <AvatarImage
                          src={env('API_URL') + employee.avatar}
                          alt={employee.name}
                          className="rounded-lg transition-transform group-hover:scale-110"
                        />
                      </div>
                      <AvatarImage
                        src={env('API_URL') + employee.avatar}
                        alt={employee.name}
                        className="absolute left-0 top-0 -z-10 opacity-0 transition-all group-hover:-left-2 group-hover:-top-2 group-hover:opacity-100 group-hover:blur-md"
                      />
                    </div>
                    <AvatarFallback className="rounded-lg">
                      {employee.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center text-xl">
                    {employee.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
