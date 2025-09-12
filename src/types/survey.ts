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

export type AnswerSurveyRequest = {
  version: number;
  respondent_type_id: number;
  email: string;
  employee_service_id: number;
  answers: {
    question_id: number;
    answer: number;
  }[];
  observation: string;
};
