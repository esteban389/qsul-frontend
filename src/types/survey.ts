import type { NewSurveyVersionQuestionRequest, Question } from './question';

export type Survey = {
  id: number;
  version: number;
  questions: Question[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type NewSurveyVersionRequest = {
  questions: NewSurveyVersionQuestionRequest[];
  keep_service_questions: boolean;
};