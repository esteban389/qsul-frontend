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

// Storage key for localStorage
const STORAGE_KEY = 'report-filters-state';

// Helper to handle date serialization/deserialization
const serializeState = (state: State): string => {
  return JSON.stringify(state);
};

const deserializeState = (storedState: string | null): Partial<State> => {
  if (!storedState) return {};

  try {
    const parsed = JSON.parse(storedState);

    // Convert date strings back to Date objects
    if (parsed.start_date) parsed.start_date = new Date(parsed.start_date);
    if (parsed.end_date) parsed.end_date = new Date(parsed.end_date);

    return parsed;
  } catch (e) {
    console.error('Failed to parse stored state:', e);
    return {};
  }
};

export const cleanupStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const createReportStore: () => StateActions & StoreActions = () => {
  // Initial default state
  const initialState: State = {
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
  };

  // Try to load state from localStorage
  const storedState = deserializeState(
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  );

  // Merge initial state with stored state
  let state: State = { ...initialState, ...storedState };
  let defaultState: State = { ...initialState };


  const listeners = new Set<() => void>();

  // Function to save state to localStorage
  const saveToStorage = (state: State) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, serializeState(state));
      }
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  };

  // Function to update state and notify listeners
  const updateState = (newState: Partial<State>) => {
    console.log(newState, state)
    state = { ...state, ...newState };
    listeners.forEach(listener => listener());
    saveToStorage(state);
  };

  return {
    subscribe: (callback: () => void) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    getSnapshot: () => state,
    getServerSnapshot: () => state,
    applyFilter: (filter, value) => {
      updateState({ [filter]: value });
    },
    selectCampus: (campus: number) => {
      updateState({
        campus,
        process: 0,
        service: 0,
        employee: 0,
        category: 'process',
        group_by: 'processes',
        step: 2
      });
    },
    selectProcess: (process: number) => {
      updateState({
        process,
        service: 0,
        employee: 0,
        category: 'service',
        group_by: 'services',
        step: 3
      });
    },
    selectService: (service: number) => {
      updateState({
        service,
        employee: 0,
        category: 'employee',
        group_by: 'employees',
        step: 4
      });
    },
    selectEmployee: (employee: number) => {
      updateState({
        employee,
        category: 'service',
        group_by: 'services',
        step: 5
      });
    },
    setDefaultState: (getNewDefaultState: (oldDefault: State) => State) => {
      const newDefaultState = getNewDefaultState(defaultState);
      defaultState = { ...defaultState, ...newDefaultState };
      updateState(defaultState);
    },
    clearFilters() {
      updateState(defaultState);
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