import { useSyncExternalStore } from "react";
import { categories } from "./category";
import { ChartRequest } from "@/types/chart";
import { format } from "date-fns";

type State = {
  employee: number;
  campus: number;
  start_date: Date;
  end_date: Date;
  process: number;
  service: number;
  survey: number;
  category: keyof typeof categories;
  group_by: "campuses" | "processes" | "services" | "employees";
  time_frame: 'year' | 'month';
  step: number;
}

type ClientMutableState = Omit<State, "category" | "category_description" | "group_by">

type BasicFilters = Omit<ClientMutableState, "employee" | "campus" | "process" | "service">

type StateActions = {
  applyFilter: <K extends keyof BasicFilters>(filter: K, value: State[K]) => void;
  getState: () => State;
  getStateSlice: <K extends keyof State>(filter: K) => State[K];
  getRequest: () => Partial<ChartRequest>;
  selectCampus: (campus: number) => void;
  selectProcess: (process: number) => void;
  selectService: (service: number) => void;
  selectEmployee: (employee: number) => void;
  clearFilters: () => void;
  setDefaultState: (getDef: (oldDefault: State) => State) => void;
}

type StoreActions = {
  subscribe: (callback: () => void) => () => void,
  getSnapshot: () => State,
  getServerSnapshot: () => State
}

const createReportStore: () => StateActions & StoreActions = () => {
  let state: State = {
    employee: 0,
    campus: 0,
    start_date: new Date(),
    end_date: new Date(),
    process: 0,
    service: 0,
    survey: 0,
    category: 'campus',
    group_by: 'campuses',
    time_frame: 'month',
    step: 1,
  }
  let defaultState: State = {
    employee: 0,
    campus: 0,
    start_date: new Date(),
    end_date: new Date(),
    process: 0,
    service: 0,
    survey: 0,
    category: 'campus',
    group_by: 'campuses',
    time_frame: 'month',
    step: 1,
  }

  const listeners = new Set<() => void>();

  return {
    subscribe: (callback: () => void) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    getSnapshot: () => state,
    getServerSnapshot: () => state,
    applyFilter: (filter, value) => {
      state = { ...state, [filter]: value }
      listeners.forEach(listener => listener());
    },
    selectCampus: (campus: number) => {
      //Reset process, service and employee to 0 And set category to campus
      state = { ...state, campus, process: 0, service: 0, employee: 0, category: 'process', group_by: 'processes', step: 2 }
      listeners.forEach(listener => listener());
    },
    selectProcess: (process: number) => {
      //Reset service and employee to 0 And set category to process
      state = { ...state, process, service: 0, employee: 0, category: 'service', group_by: 'services', step: 3 }
      listeners.forEach(listener => listener());
    },
    selectService: (service: number) => {
      //Reset employee to 0 And set category to service
      state = { ...state, service, employee: 0, category: 'employee', group_by: 'employees', step: 4 }
      listeners.forEach(listener => listener());
    },
    selectEmployee: (employee: number) => {
      //Set category to employee
      state = { ...state, employee, category: 'service', group_by: 'services', step: 5 }
      listeners.forEach(listener => listener());
    },
    setDefaultState: (getNewDefaultState: (oldDefault: State) => State) => {
      const newDefaultState = getNewDefaultState(defaultState);
      defaultState = { ...defaultState, ...newDefaultState }
      state = { ...state, ...defaultState }
      listeners.forEach(listener => listener());
    },
    clearFilters() {
      state = { ...state, ...defaultState }
      listeners.forEach(listener => listener());
    },
    getState: () => state,
    getStateSlice: <K extends keyof State>(filter: K) => state[filter],
    getRequest: () => {
      return {
        start_date: format(state.start_date, "yyyy-MM-dd"),
        end_date: format(state.end_date, "yyyy-MM-dd"),
        survey: state.survey,
        campus: state.campus !== 0 ? state.campus : undefined,
        process: state.process !== 0 ? state.process : undefined,
        service: state.service !== 0 ? state.service : undefined,
        employee: state.employee !== 0 ? state.employee : undefined,
        group_by: state.group_by,
        time_frame: state.time_frame,
      }
    },
  }
}

const store = createReportStore();

export function useFiltersState(): StateActions {
  const { subscribe, getSnapshot, getServerSnapshot, ...actions } = store;
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return actions;
}