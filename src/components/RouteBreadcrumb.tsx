import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

function RouteBreadcrumb() {
  const route = usePathname();
  const routes = route.split('/').filter(Boolean);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {route !== '/Inicio' && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/Inicio">Inicio</Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        )}
        {routes.map((route, index) => (
          <BreadcrumbItem key={route}>
            <BreadcrumbLink asChild>
              <Link href={`/${routes.slice(0, index + 1).join('/')}`}>
                {route}
              </Link>
            </BreadcrumbLink>
            {index < routes.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default RouteBreadcrumb;
