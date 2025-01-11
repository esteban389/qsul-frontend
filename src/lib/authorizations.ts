import { Role } from '@/types/user';
import useAuth from '@/hooks/useAuth';

export type entities =
  | 'user'
  | 'campus'
  | 'employee'
  | 'process'
  | 'service'
  | 'survey';

export type operations = 'create' | 'read' | 'update' | 'delete';

export type Authorization = {
  entity: entities;
  operation: operations;
};

export type RoleAuthorization = Record<Role, Authorization[]>;

const authorizations: RoleAuthorization = {
  [Role.NATIONAL_COORDINATOR]: [
    { entity: 'user', operation: 'create' },
    { entity: 'user', operation: 'read' },
    { entity: 'user', operation: 'delete' },
    { entity: 'campus', operation: 'create' },
    { entity: 'campus', operation: 'read' },
    { entity: 'campus', operation: 'update' },
    { entity: 'campus', operation: 'delete' },
    { entity: 'employee', operation: 'read' },
    { entity: 'process', operation: 'create' },
    { entity: 'process', operation: 'read' },
    { entity: 'process', operation: 'update' },
    { entity: 'process', operation: 'delete' },
    { entity: 'service', operation: 'create' },
    { entity: 'service', operation: 'read' },
    { entity: 'service', operation: 'update' },
    { entity: 'service', operation: 'delete' },
    { entity: 'survey', operation: 'create' },
    { entity: 'survey', operation: 'read' },
    { entity: 'survey', operation: 'update' },
    { entity: 'survey', operation: 'delete' },
  ],
  [Role.CAMPUS_COORDINATOR]: [
    { entity: 'user', operation: 'create' },
    { entity: 'user', operation: 'read' },
    { entity: 'user', operation: 'delete' },
    { entity: 'employee', operation: 'create' },
    { entity: 'employee', operation: 'read' },
    { entity: 'employee', operation: 'update' },
    { entity: 'employee', operation: 'delete' },
    { entity: 'process', operation: 'read' },
    { entity: 'service', operation: 'read' },
  ],
  [Role.PROCESS_LEADER]: [
    { entity: 'user', operation: 'read' },
    { entity: 'employee', operation: 'read' },
    { entity: 'process', operation: 'read' },
    { entity: 'service', operation: 'read' },
  ],
};

const can = (role: Role, entity: entities, operation: operations) => {
  const roleAuthorizations = authorizations[role];

  if (!roleAuthorizations) return false;

  return roleAuthorizations.some(
    authorization =>
      authorization.entity === entity && authorization.operation === operation,
  );
};

export const useAuthorize = () => {
  const { user } = useAuth({
    redirectIfAuthenticated: '/',
    middleware: 'auth',
  });

  return (operation: operations, entity: entities) => {
    if (!user) return false;

    return can(user.role, entity, operation);
  };
};
