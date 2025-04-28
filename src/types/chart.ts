export type ChartRequest = {
  start_date: string;
  end_date: string;
  survey: number;
  campus: number;
  process: number;
  service: number;
  employee: number;
  group_by: string;
}

export type GroupedTrendChartResponse = {
  labels: string[];
  data: {
    period: string;
  } & {
    [key: string]: number[];
  }[];
}

export type PerceptionResponse = {
  id: number;
  name: string;
  average_perception: number;
}

export type VolumeResponse = {
  id: number;
  name: string;
  feedback_count: number;
}

export type StackedResponse = {
  labels: string[];
  data: {
    group_name: string;
  } & {
    [key: string]: number[];
  }[];
}

export type RankingResponse = {
  id: number;
  name: string;
  average_perception: number;
  answer_count: number;
  image: string;
}

export type PerceptionQuestionChartResponse = {
  labels: string[];
  data: {
    question: string;
  } & {
    [key: string]: number[];
  }[];
}