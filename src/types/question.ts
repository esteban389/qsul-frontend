import type { Service } from './service';

export type Question = {
  id: number;
  text: string;
  type: 'yesno' | 'radio';
  order: string;
  survey_id: number;
  service_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  service: Service | null;
};

export type CreateServiceQuestionRequest = {
  text: string;
  type: 'yesno' | 'radio';
  service_id: number;
};

export type UpdateServiceQuestionRequest = {
  text?: string;
  type?: 'yesno' | 'radio';
  order?: number;
  question_id: number;
};

export type NewSurveyVersionQuestionRequest = {
  text: string;
  type: 'yesno' | 'radio';
  order: number;
};
