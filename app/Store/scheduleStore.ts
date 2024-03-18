import { create } from 'zustand';

interface EventData {
    EVENT_NM: string;
    AA_YMD: string; // 'YYYYMMDD' 형식
    DISPLAY_DATE: string; // 'YYYY년 MM월 DD일' 형식
}

interface ScheduleState {
    todayEvents: Array<EventData>;
    upcomingEvents: Array<EventData>;
    monthEvents: Array<EventData>;
    isLoading: boolean;
    setTodayEvents: (todayEvents: Array<EventData>) => void;
    setUpcomingEvents: (upcomingEvents: Array<EventData>) => void;
    setMonthEvents: (monthEvents: Array<EventData>) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
    todayEvents: [],
    upcomingEvents: [],
    monthEvents: [],
    sortedEvents: {},
    isLoading: true,
    setTodayEvents: (todayEvents) => set({ todayEvents }),
    setUpcomingEvents: (upcomingEvents) => set({ upcomingEvents }),
    setMonthEvents: (monthEvents) => set({ monthEvents }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));