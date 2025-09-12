import { ElementType } from 'react';
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  ChartPie,
  FileCheck,
  FilePenLine,
  History,
  Home,
  LayoutPanelTop,
  NotebookTabs,
  Package,
  User,
  Users,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { Role } from '@/types/user';

export type RoutePattern =
  | string
  | `${string}/[${string}]`
  | `${string}/[${string}]/${string}`;

export type BaseRoute = {
  name: string;
  displayName: string;
  icon: ElementType;
  authorizedRoles: Role[];
};

export type NavigableRoute = BaseRoute & {
  path: RoutePattern;
  showInSidebar: boolean;
  children?: NestedRoute[];
};

export type NestedRoute = BaseRoute & {
  path: RoutePattern;
  parent: string; // Reference to parent route name
};

export type Route = NavigableRoute | NestedRoute;

export type RouteGroup = {
  name: string;
  displayName: string;
  routes: NavigableRoute[];
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
        showInSidebar: true,
        authorizedRoles: [Role.NATIONAL_COORDINATOR, Role.CAMPUS_COORDINATOR],
      },
      {
        displayName: 'Seccionales',
        name: 'campuses',
        path: '/seccionales',
        icon: Building2,
        authorizedRoles: [Role.NATIONAL_COORDINATOR],
        showInSidebar: true,
      },
      {
        displayName: 'Procesos',
        name: 'processes',
        path: '/procesos',
        icon: LayoutPanelTop,
        showInSidebar: true,
        authorizedRoles: [Role.NATIONAL_COORDINATOR, Role.CAMPUS_COORDINATOR],
      },
      {
        displayName: 'Servicios',
        name: 'services',
        path: '/servicios',
        icon: Package,
        showInSidebar: true,
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
        showInSidebar: true,
        icon: BriefcaseBusiness,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
      {
        displayName: 'Solicitudes de cambio',
        name: 'profile-change-requests',
        path: '/solicitudes-cambio',
        icon: FileCheck,
        showInSidebar: true,
        authorizedRoles: [Role.NATIONAL_COORDINATOR, Role.CAMPUS_COORDINATOR],
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
        showInSidebar: true,
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
        showInSidebar: true,
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
        showInSidebar: true,
        icon: NotebookTabs,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
        children: [
          {
            displayName: 'Detalle de Reporte',
            name: 'report-detail',
            path: '/reporte-detallado/[id]',
            icon: ChartPie,
            parent: 'report',
            authorizedRoles: [
              Role.NATIONAL_COORDINATOR,
              Role.CAMPUS_COORDINATOR,
              Role.PROCESS_LEADER,
            ],
          },
        ],
      },
      {
        displayName: 'Historial de cambios',
        name: 'history',
        path: '/historial-encuesta',
        showInSidebar: true,
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
        showInSidebar: true,
        icon: Activity,
        authorizedRoles: [Role.NATIONAL_COORDINATOR],
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
        showInSidebar: false,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
    ],
  },
 {
    name: 'profile',
    displayName: 'Perfil',
    routes: [
      {
        displayName: 'Perfil',
        name: 'profile',
        path: '/perfil',
        icon: User,
        showInSidebar: false,
        authorizedRoles: [
          Role.NATIONAL_COORDINATOR,
          Role.CAMPUS_COORDINATOR,
          Role.PROCESS_LEADER,
        ],
      },
    ],
  },
];

export const isNavigableRoute = (route: Route): route is NavigableRoute => {
  return 'showInSidebar' in route && route.showInSidebar;
};

export const matchRoute = (
  pathname: string,
  routePath: RoutePattern,
): boolean => {
  // Convert route pattern to regex
  const pattern = routePath
    .replace(/\[([^\]]+)\]/g, '([^/]+)') // Convert [param] to capture group
    .replace(/\//g, '\\/'); // Escape forward slashes

  const regex = new RegExp(`^${pattern}$`);
  return regex.test(pathname);
};
/*
|-----------------------------------------------------------------------------
| Hook to get the route by its path
|-----------------------------------------------------------------------------
|
| Search in the existing routes for the one that matches the given path.
*/
export const useRouteByPath = (pathname: string) => {
  const routes = useUserRoutes();
  let matchedRoute: Route | undefined;

  // Helper function to check routes recursively
  const findRoute = (routes: NavigableRoute[]) => {
    for (const route of routes) {
      if (matchRoute(pathname, route.path)) {
        matchedRoute = route;
        return;
      }
      // Check children routes
      if (route.children) {
        for (const child of route.children) {
          if (matchRoute(pathname, child.path)) {
            matchedRoute = child;
            return;
          }
        }
      }
    }
  };

  // Search through all route groups
  routes.forEach(group => {
    findRoute(group.routes);
  });

  return matchedRoute;
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
      routes: group.routes.filter(route => {
        const isAuthorized = route.authorizedRoles.includes(user.role);
        // Also check children routes
        if (route.children) {
          route.children = route.children.filter(child =>
            child.authorizedRoles.includes(user.role),
          );
        }
        return isAuthorized;
      }),
    }))
    .filter(group => group.routes.length > 0);
};

export const findByName = (name: string): Route | undefined => {
  const findInRoutes = (routes: NavigableRoute[]): Route | undefined => {
    for (const route of routes) {
      if (route.name === name) return route;
      if (route.children) {
        const childRoute = route.children.find(child => child.name === name);
        if (childRoute) return childRoute;
      }
    }
    return undefined;
  };

  for (const group of routeGroups) {
    const route = findInRoutes(group.routes);
    if (route) return route;
  }

  return undefined;
};
