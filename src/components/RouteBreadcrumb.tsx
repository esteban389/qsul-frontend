import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Route, useUserRoutes } from '@/lib/routes';

type BreadcrumbSegment = {
  path: string;
  displayName: string;
};

function findMatchingRoute(
  path: string,
  routeGroups: ReturnType<typeof useUserRoutes>,
): Route | undefined {
  // Helper to check if a path matches a route pattern
  const matchesPattern = (routePath: string, currentPath: string) => {
    const routeParts = routePath.split('/');
    const pathParts = currentPath.split('/');

    if (routeParts.length !== pathParts.length) return false;

    return routeParts.every((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) return true;
      return part === pathParts[i];
    });
  };

  for (const group of routeGroups) {
    for (const route of group.routes) {
      // Check main route
      if (matchesPattern(route.path, path)) {
        return route;
      }
      // Check children routes if they exist
      if ('children' in route && route.children) {
        for (const child of route.children) {
          if (matchesPattern(child.path, path)) {
            return child;
          }
        }
      }
    }
  }
  return undefined;
}

function getBreadcrumbSegments(
  currentPath: string,
  routeGroups: ReturnType<typeof useUserRoutes>,
): BreadcrumbSegment[] {
  const pathSegments = currentPath.split('/').filter(Boolean);
  const segments: BreadcrumbSegment[] = [];

  let accumulatedPath = '';
  for (const segment of pathSegments) {
    accumulatedPath += `/${segment}`;

    const route = findMatchingRoute(accumulatedPath, routeGroups);

    segments.push({
      path: accumulatedPath,
      displayName: route?.displayName ?? segment,
    });
  }

  return segments;
}

function RouteBreadcrumb() {
  const pathname = usePathname();
  const routeGroups = useUserRoutes();
  const segments = getBreadcrumbSegments(pathname, routeGroups);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname !== '/inicio' && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/inicio">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {segments.length > 0 && <BreadcrumbSeparator />}

        {segments.map((segment, index) => (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={segment.path}>{segment.displayName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < segments.length - 1 && <BreadcrumbSeparator key={segment.path +"-separator"} />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default RouteBreadcrumb;
