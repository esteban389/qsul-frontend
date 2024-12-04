import type { Process } from '@/types/process';

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
};

export type CreateServiceRequest = {
  name: string;
  icon: File;
  process_id: number;
};
