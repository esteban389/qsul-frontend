import { ElementType } from 'react';
import { Home, Users } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { Role } from '@/types/user';

export type RouteGroup = {
  name: string;
  displayName: string;
  routes: Route[];
};

export type Route = {
  name: string;
  path: string;
  icon: ElementType;
  authorizedRoles: Role[];
  displayName: string;
};

/*
|-----------------------------------------------------------------------------
| Application Authenticated Routes
|-----------------------------------------------------------------------------
|
| Each route in this array represents a specific path that authenticated users
| can access. Only routes that require user authentication and authorization
| should be added here.
*/
const routeGroups: RouteGroup[] = [
  {
    name: 'admin',
    displayName: 'Administrar',
    routes: [
      {
        displayName: 'Usuarios',
        name: 'users',
        path: '/usuarios',
        icon: Users,
        authorizedRoles: [Role.NATIONAL_COORDINATOR, Role.CAMPUS_COORDINATOR],
      },
    ],
  },
  {
    name: 'home',
    displayName: 'Inicio',
    routes: [
      {
        displayName: 'Inicio',
        name: 'home',
        path: '/inicio',
        icon: Home,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
    ],
  },
];

export const getRouteByName = (name: string) => {
  return routeGroups.find(route => route.name === name);
};

export const useUserRoutes = (): RouteGroup[] => {
  const { user } = useAuth({ middleware: 'auth' });
  if (!user) return [];

  return routeGroups
    .map(group => ({
      ...group,
      routes: group.routes.filter(route =>
        route.authorizedRoles.includes(user.role),
      ),
    }))
    .filter(group => group.routes.length > 0);
};
