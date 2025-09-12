import type { Campus } from './campus';
import type { Process } from './process';
import type { Service } from './service';

export type Employee = {
  id: number;
  name: string;
  email: string;
  token: string;
  avatar: string;
  campus_id: number;
  process_id: number;
  service_id: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  process?: Process;
  campus?: Campus;
  services?: Service[];
};

export type CreateEmployeeRequest = {
  name: string;
  email: string;
  process_id: number;
  avatar: File;
};

export type UpdateEmployeeRequest = {
  name: string;
  email: string;
  avatar: File | null | undefined;
  process_id: number;
};
