import { create } from "zustand";

interface MealInfo {
  MLSV_YMD: string;
  DDISH_NM: string;
  CAL_INFO: string;
}

interface MealInfoState {
  mealInfos: Array<MealInfo>;
  isLoading: boolean;
  error: string | null;
  isLeftDisabled: boolean;
  isRightDisabled: boolean;
  setMealInfos: (mealInfos: Array<MealInfo>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setIsLeftDisabled: (isDisabled: boolean) => void;
  setIsRightDisabled: (isDisabled: boolean) => void;
}

export const useMealInfoStore = create<MealInfoState>((set) => ({
  mealInfos: [],
  isLoading: true,
  error: null,
  isLeftDisabled: true,
  isRightDisabled: true,
  setMealInfos: (mealInfos) => set({ mealInfos }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setIsLeftDisabled: (isLeftDisabled) => set({ isLeftDisabled }),
  setIsRightDisabled: (isRightDisabled) => set({ isRightDisabled }),
}));
