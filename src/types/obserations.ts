import { User } from './user';

export type ObservationType = 'positive' | 'neutral' | 'negative';

export type Observation = {
  id: string;
  user_id: number;
  answer_id: number;
  description: string;
  type: ObservationType;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user: User;
};

export type CreateObservationRequest = {
  description: string;
  type: ObservationType;
  answer_id: number;
};
