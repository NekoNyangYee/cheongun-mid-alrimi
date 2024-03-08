import { create } from 'zustand';

interface EventData {
    EVENT_NM: string;
    AA_YMD: string; // 'YYYYMMDD' 형식
    DISPLAY_DATE: string; // 'YYYY년 MM월 DD일' 형식
}

interface ScheduleState {
    todayEvents: Array<EventData>;
    upcomingEvents: Array<EventData>;
    setTodayEvents: (todayEvents: Array<EventData>) => void;
    setUpcomingEvents: (upcomingEvents: Array<EventData>) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
    todayEvents: [],
    upcomingEvents: [],
    setTodayEvents: (todayEvents) => set({ todayEvents }),
    setUpcomingEvents: (upcomingEvents) => set({ upcomingEvents }),
}));