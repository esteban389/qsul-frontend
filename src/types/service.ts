import type { Process } from '@/types/process';

export type EmployeeServicePivot = {
  id: number;
  employee_id: number;
  service_id: number;
};

export type Service = {
  id: number;
  name: string;
  icon: string;
  token: string;
  process_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  process?: Process;
  pivot?: EmployeeServicePivot;
};

export type CreateServiceRequest = {
  name: string;
  icon: File;
  process_id: number;
};

export type UpdateServiceRequest = {
  name: string;
  icon: File | null | undefined;
  process_id: number;
};
