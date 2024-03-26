import { create } from "zustand";

interface MealInfo {
  MLSV_YMD: string;
  DDISH_NM: string;
  CAL_INFO: string;
}

interface MealInfoState {
  mealInfos: Array<MealInfo>;
  allMealInfos: Array<MealInfo>;
  isLoading: boolean;
  isLeftDisabled: boolean;
  isRightDisabled: boolean;
  rotate: boolean;
  showBackToTodayButton: boolean;
  setMealInfos: (mealInfos: Array<MealInfo>) => void;
  setAllMealInfos: (allMealInfos: Array<MealInfo>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLeftDisabled: (isDisabled: boolean) => void;
  setIsRightDisabled: (isDisabled: boolean) => void;
  setRotate: (rotate: boolean) => void;
  setShowBackToTodayButton: (show: boolean) => void;
}

export const useMealInfoStore = create<MealInfoState>((set) => ({
  mealInfos: [],
  allMealInfos: [],
  isLoading: true,
  isLeftDisabled: true,
  isRightDisabled: true,
  rotate: false,
  showBackToTodayButton: false,
  setMealInfos: (mealInfos) => set({ mealInfos }),
  setAllMealInfos: (allMealInfos: Array<MealInfo>) => set({ allMealInfos }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsLeftDisabled: (isLeftDisabled) => set({ isLeftDisabled }),
  setIsRightDisabled: (isRightDisabled) => set({ isRightDisabled }),
  setRotate: (rotate) => set({ rotate }),
  setShowBackToTodayButton: (show) => set({ showBackToTodayButton: show }),
}));
