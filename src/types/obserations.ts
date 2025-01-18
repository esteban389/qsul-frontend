import { User } from './user';

export type Observation = {
  id: string;
  user_id: number;
  answer_id: number;
  description: string;
  type: 'positive' | 'neutral' | 'negative';
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user: User;
};
