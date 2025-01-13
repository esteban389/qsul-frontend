import { Employee } from './employee';
import { RespondentType } from './respondentType';
import { Service } from './service';
import { Survey } from './survey';

export type Answer = {
  id: string;
  email: string;
  average: number;
  survey_id: number;
  respondent_type_id: number;
  employee_service_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  survey: Survey;
  respondent_type: RespondentType;
  employee_service: {
    employee_id: string;
    service_id: string;
    employee: Employee;
    service: Service;
  };
};

export type GetAnswersRequestFilters = {
  survey_id?: number;
  respondent_type_id?: number;
  'employeeService.employee.campus_id'?: number;
  'employeeService.employee.process_id'?: number;
  'employeeService.service_id'?: number;
  email?: string;
  result?: 'insufficent' | 'sufficent' | 'good';
  before?: string;
  after?: string;
};
