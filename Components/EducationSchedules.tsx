"use client";

import React, { useState, useEffect } from "react";

interface EventData {
  EVENT_NM: string;
  AA_YMD: string; // 'YYYYMMDD' 형식
  DISPLAY_DATE: string; // 'YYYY년 MM월 DD일' 형식
}

const EducationSchedules: React.FC = () => {
  const [todayEvents, setTodayEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear(); // 현재 년도
  const currentMonth = currentDate.getMonth() + 1; // 현재 월
  const currentDay = currentDate.getDate(); // 현재 일
  const formattedCurrentDate = `${currentYear}${currentMonth.toString().padStart(2, '0')}${currentDay.toString().padStart(2, '0')}`;
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
        const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
        const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;

        const startDateOfYear = `${currentYear}`;
        const response = await fetch(`/api/education?endpoint=SchoolSchedule&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AA_YMD=${startDateOfYear}`);

        if (!response.ok) {
          throw new Error('데이터를 불러오는 중에 오류가 발생했습니다.');
        }
        const data = await response.json();

        const filteredEvents = data.SchoolSchedule[1].row
          .map((event: any) => ({
            EVENT_NM: event.EVENT_NM,
            AA_YMD: event.AA_YMD,
            DISPLAY_DATE: `${event.AA_YMD.substring(0, 4)}년 ${parseInt(event.AA_YMD.substring(4, 6), 10)}월 ${parseInt(event.AA_YMD.substring(6), 10)}일`,
          }));

        // 오늘 일정
        const todayEvents = filteredEvents.filter((event: { AA_YMD: string; }) => event.AA_YMD === formattedCurrentDate);
        // 예정된 일정
        const upcomingEvents = filteredEvents.filter((event: { AA_YMD: number; }) => Number(event.AA_YMD) > Number(formattedCurrentDate)).slice(0, 2);
        setTodayEvents(todayEvents);
        setPastEvents(pastEvents);
        setUpcomingEvents(upcomingEvents);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{currentMonth}월의 학사일정</h1>
      {todayEvents.length > 0 ? (
        <>
          <h2>오늘의 일정</h2>
          <ul>
            {todayEvents.map((event, index) => (
              <li key={index}>{`${event.EVENT_NM} - ${event.DISPLAY_DATE}`}</li>
            ))}
          </ul>
        </>
      ) : <p>오늘 학사 일정이 없어요.</p>}
      <h2>예정된 일정</h2>
      {upcomingEvents.length > 0 ? (
        <ul>
          {upcomingEvents.map((event, index) => (
            <li key={index}>{`${event.EVENT_NM} - ${event.DISPLAY_DATE}`}</li>
          ))}
        </ul>
      ) : (
        <p>예정된 일정이 없습니다.</p>
      )}
    </div>
  );
};

export default EducationSchedules;