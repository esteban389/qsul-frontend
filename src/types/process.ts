import type { Service } from '@/types/service';

export type Process = {
  id: number;
  name: string;
  icon: string;
  parent_id: number;
  parent: Process | null;
  sub_processes: Process[];
  services: Service[];
  token: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type CreateProcessRequest = {
  name: string;
  icon: File | null | undefined;
  parent_id: number | null | undefined;
};

export type UpdateProcessRequest = {
  name: string;
  icon: File | null | undefined;
  parent_id: number | null | undefined;
};
