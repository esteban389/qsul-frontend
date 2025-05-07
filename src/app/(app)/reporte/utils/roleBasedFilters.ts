import { Employee } from '@/types/employee';
import { Role, User } from '@/types/user';

/**
 * Determines which filters should be available based on user role
 * 
 * - National Coordinator: Can see all filters
 * - Campus Coordinator: Restricted to their own campus
 * - Process Leader: Restricted to their own process
 */
export const getAvailableFilters = (user: User | null, employeeData: Employee | null) => {
  if (!user) {
    return {
      canSelectCampus: false,
      canSelectProcess: false,
      canSelectService: false,
      canSelectEmployee: false,
      defaultCampusId: undefined,
      defaultProcessId: undefined,
    };
  }

  switch (user.role) {
    case Role.NATIONAL_COORDINATOR:
      // National Coordinators can see all filters and don't have default values
      return {
        canSelectCampus: true,
        canSelectProcess: true,
        canSelectService: true,
        canSelectEmployee: true,
        defaultCampusId: undefined,
        defaultProcessId: undefined,
      };
    case Role.CAMPUS_COORDINATOR:
      return {
        canSelectCampus: false, // Campus is fixed to their own campus
        canSelectProcess: true,
        canSelectService: true,
        canSelectEmployee: true,
        defaultCampusId: user.campus_id || undefined,
        defaultProcessId: undefined,
      };
    case Role.PROCESS_LEADER:
      return {
        canSelectCampus: false, // Campus is fixed to their own campus
        canSelectProcess: false, // Process is fixed to their own process
        canSelectService: true,
        canSelectEmployee: true,
        defaultCampusId: user.campus_id || undefined,
        defaultProcessId: employeeData?.process_id || undefined,
      };
    default:
      return {
        canSelectCampus: false,
        canSelectProcess: false,
        canSelectService: false,
        canSelectEmployee: false,
        defaultCampusId: undefined,
        defaultProcessId: undefined,
      };
  }
};

/**
 * Determines the initial filter step based on user role
 */
export const getInitialFilterStep = (user: User): number => {
  if (!user) return 1;
  
  switch (user.role) {
    case Role.NATIONAL_COORDINATOR:
      return 1; // Start at campus selection
    case Role.CAMPUS_COORDINATOR:
      return 2; // Skip campus selection, start at process selection
    case Role.PROCESS_LEADER:
      return 3; // Skip campus and process selection, start at service selection
    default:
      return 1;
  }
};
