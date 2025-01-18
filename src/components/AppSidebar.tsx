'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ComponentProps } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { isNavigableRoute, Route, useUserRoutes } from '@/lib/routes';
import { usePathname } from 'next/navigation';

export default function AppSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const routeGroups = useUserRoutes()
    .map(group => ({
      ...group,
      routes: group.routes.filter(route => isNavigableRoute(route)),
    }))
    .filter(group => group.routes.length > 0);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/inicio" className="flex flex-row items-center gap-4">
              <Avatar className="aspect-square size-8">
                <AvatarImage
                  className="size-fit"
                  src="/universidad-libre-logo.webp"
                />
                <AvatarFallback>UL</AvatarFallback>
              </Avatar>
              <span className="truncate font-semibold">Universidad Libre</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {routeGroups.map(group => (
          <SidebarGroup key={group.name}>
            <SidebarGroupLabel>{group.displayName}</SidebarGroupLabel>
            {group.routes.map(route => (
              <AppSidebarItem key={route.name} route={route} />
            ))}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

function AppSidebarItem({ route }: { route: Route }) {
  const Icon = route.icon;
  const pathname = usePathname();

  const isActive =
    pathname === route.path ||
    route.children?.some(child => pathname.startsWith(route.path));
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="truncate hover:bg-transparent"
        tooltip={route.displayName}
        asChild>
        <Link
          href={route.path}
          className={
            isActive
              ? 'border-2 border-primary-foreground bg-background shadow-md hover:bg-background'
              : undefined
          }>
          <Icon /> {route.displayName}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
