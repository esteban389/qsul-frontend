import { User } from './user';

export type Audit = {
  id: number;
  user_type: string;
  user_id: number;
  event: 'created' | 'updated' | 'deleted';
  auditable_type: string;
  auditable_id: number;
  old_values: string;
  new_values: string;
  url: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  updated_at: string;
  author: User;
};
