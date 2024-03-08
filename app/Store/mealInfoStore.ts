import { create } from "zustand";

interface MealInfo {
  MLSV_YMD: string;
  DDISH_NM: string;
  CAL_INFO: string;
}

interface MealInfoState {
  mealInfos: Array<MealInfo>;
  isLoading: boolean;
  isLeftDisabled: boolean;
  isRightDisabled: boolean;
  setMealInfos: (mealInfos: Array<MealInfo>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLeftDisabled: (isDisabled: boolean) => void;
  setIsRightDisabled: (isDisabled: boolean) => void;
}

export const useMealInfoStore = create<MealInfoState>((set) => ({
  mealInfos: [],
  isLoading: true,
  isLeftDisabled: true,
  isRightDisabled: true,
  setMealInfos: (mealInfos) => set({ mealInfos }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsLeftDisabled: (isLeftDisabled) => set({ isLeftDisabled }),
  setIsRightDisabled: (isRightDisabled) => set({ isRightDisabled }),
}));
