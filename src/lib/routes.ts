import { ElementType } from 'react';
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  ChartPie,
  FilePenLine,
  History,
  Home,
  LayoutPanelTop,
  NotebookTabs,
  Package,
  Users,
} from 'lucide-react';
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
      {
        displayName: 'Seccionales',
        name: 'campuses',
        path: '/seccionales',
        icon: Building2,
        authorizedRoles: [Role.NATIONAL_COORDINATOR],
      },
      {
        displayName: 'Procesos',
        name: 'processes',
        path: '/procesos',
        icon: LayoutPanelTop,
        authorizedRoles: [Role.NATIONAL_COORDINATOR, Role.CAMPUS_COORDINATOR],
      },
      {
        displayName: 'Servicios',
        name: 'services',
        path: '/servicios',
        icon: Package,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
      {
        displayName: 'Empleados',
        name: 'employees',
        path: '/empleados',
        icon: BriefcaseBusiness,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
    ],
  },
  {
    name: 'survey',
    displayName: 'Encuesta',
    routes: [
      {
        displayName: 'Preguntas',
        name: 'questions',
        path: '/preguntas',
        icon: FilePenLine,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
      {
        displayName: 'Reporte general',
        name: 'report',
        path: '/reporte',
        icon: ChartPie,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
      {
        displayName: 'Reporte detallado',
        name: 'detailed-report',
        path: '/reporte-detallado',
        icon: NotebookTabs,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
      {
        displayName: 'Historial de cambios',
        name: 'history',
        path: '/historial-encuesta',
        icon: History,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
    ],
  },
  {
    name: 'audit',
    displayName: 'Auditoría',
    routes: [
      {
        displayName: 'Auditoría',
        name: 'audit',
        path: '/auditoria',
        icon: Activity,
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
/*
|-----------------------------------------------------------------------------
| Hook to get the route by its path
|-----------------------------------------------------------------------------
|
| Search in the existing routes for the one that matches the given path.
*/
export const useRouteByPath = (name: string) => {
  const routes = useUserRoutes();
  let route: Route | undefined;
  routes.forEach(group => {
    group.routes.forEach(r => {
      if (r.path === name) {
        route = r;
      }
    });
  });
  return route;
};
/*
|-----------------------------------------------------------------------------
| Hook to get the routes that the authenticated user can access
|-----------------------------------------------------------------------------
|
| Returns the list of routes the current is authorized to access.
*/
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

export const findByName = (name: string): Route | undefined => {
  const routes = routeGroups.map(group => group.routes).flat();
  return routes.find(route => route.name === name);
};
