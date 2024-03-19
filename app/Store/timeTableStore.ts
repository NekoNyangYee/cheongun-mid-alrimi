import { create } from "zustand";

interface TimeTableData {
  PERIO: string;
  ITRT_CNTNT: string;
  ALL_TI_YMD: string;
  GRADE: string;
  CLASS_NM: string;
}

interface Selection {
  GRADE: string;
  CLASS_NM: string;
}

interface ClassInfo {
  GRADE: string;
  CLASS_NM: string;
}

interface TimeTableState {
  timeTable: Array<TimeTableData>;
  isLoading: boolean;
  selection: Selection;
  availableClasses: Array<ClassInfo>;
  selectedDate: string;
  setTimeTable: (timeTable: Array<TimeTableData>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelection: (selection: Selection) => void;
  setAvailableClasses: (availableClasses: Array<ClassInfo>) => void;
  setSelectedDate: (selectedDate: string) => void;
}

export const useTimeTableStore = create<TimeTableState>((set) => ({
  timeTable: [],
  isLoading: true,
  selection: {
    GRADE: '1',
    CLASS_NM: '1',
  },
  availableClasses: [],
  selectedDate: '',
  setTimeTable: (timeTable: Array<TimeTableData>) => set({ timeTable }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setSelection: (selection: Selection) => set({ selection }),
  setAvailableClasses: (availableClasses: Array<ClassInfo>) => set({ availableClasses }),
  setSelectedDate: (selectedDate: string) => set({ selectedDate }),
}));