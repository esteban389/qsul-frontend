import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getInitials } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LogOut } from 'lucide-react';
import { User } from '@/types/user';
import env from '@/lib/env';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

function UserDropdown({
  className,
  user,
  logout,
}: {
  className?: string;
  user: User;
  logout: () => void;
}) {
  const imgSrc = user.avatar ? `${env('API_URL')}${user.avatar}` : '/';
  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <DropdownMenuTrigger className={className} asChild>
              <Avatar>
                <AvatarImage src={imgSrc} alt={user?.name} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent collisionPadding={16}>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs">{user.email}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="w-fit max-w-xs" collisionPadding={16}>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/perfil" className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start')}>
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/perfil?tab=cambiar-contrasena" className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start')}>
            Cambiar contraseña
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/perfil?tab=solicitud-cambios" className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start')}>
            Peticiones de cambio de perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex w-full cursor-pointer hover:!bg-destructive/10"
          onClick={() => logout()}>
          <LogOut className="text-destructive" />
          <span className="text-destructive">Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
