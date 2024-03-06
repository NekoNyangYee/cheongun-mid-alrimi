"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Link from "next/link";

const WrapSchoolScheduleContainer = styled.div(() => `
  display: flex;
  padding: 1rem;
  border: 1px solid #E4E4E7;
  border-radius: 12px;
  background-color: #FFFFFF;
  box-sizing: border-box;
  flex-direction: column;
  line-height: 1.5;

  & h2 {
    font-size: 1rem;
    margin: 16px 0 8px 0;
    color: #71717A;
    font-weight: normal;
  }

  & ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  & p {
    color: #18181B;
    font-weight: bold;
    margin: 0;
  }

  & li {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    color: #18181B;
    font-weight: bold;
  }
`);

const WrapScheduleTitle = styled.div(() => `
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
  white-space: normal; // 자동 줄바꿈을 허용하도록 설정
  overflow-wrap: break-word; // 단어가 너무 길 경우 자동으로 줄바꿈

  & .schedule-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  & h1 {
    font-size: 1rem;
    margin: 0;
  }

  & a {
    font-size: 0.9rem;
    color: #71717A;
    text-decoration: none;
    display: flex;
    align-items: center;
  }
`);

interface EventData {
  EVENT_NM: string;
  AA_YMD: string; // 'YYYYMMDD' 형식
  DISPLAY_DATE: string; // 'YYYY년 MM월 DD일' 형식
}

const EducationSchedules = () => {
  const [todayEvents, setTodayEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
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
            DISPLAY_DATE: `${parseInt(event.AA_YMD.substring(4, 6), 10)}월 ${parseInt(event.AA_YMD.substring(6), 10)}일`,
          }));

        const todayEvents = filteredEvents.filter((event: { AA_YMD: string; }) => event.AA_YMD === formattedCurrentDate);
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

  return (
    <WrapSchoolScheduleContainer>
      <WrapScheduleTitle>
        <div className="schedule-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.98077 16.1249C3.60193 16.1249 3.28125 15.9937 3.01875 15.7312C2.75625 15.4687 2.625 15.148 2.625 14.7692V4.73076C2.625 4.35191 2.75625 4.03123 3.01875 3.76873C3.28125 3.50623 3.60193 3.37498 3.98077 3.37498H5.01924V2.36535C5.01924 2.20094 5.07429 2.06368 5.18439 1.95358C5.29448 1.8435 5.43174 1.78845 5.59616 1.78845C5.76058 1.78845 5.89783 1.8435 6.00793 1.95358C6.11802 2.06368 6.17306 2.20094 6.17306 2.36535V3.37498H11.8557V2.35093C11.8557 2.19132 11.9096 2.05767 12.0173 1.94998C12.125 1.8423 12.2586 1.78845 12.4182 1.78845C12.5778 1.78845 12.7115 1.8423 12.8192 1.94998C12.9269 2.05767 12.9807 2.19132 12.9807 2.35093V3.37498H14.0192C14.398 3.37498 14.7187 3.50623 14.9812 3.76873C15.2437 4.03123 15.375 4.35191 15.375 4.73076V14.7692C15.375 15.148 15.2437 15.4687 14.9812 15.7312C14.7187 15.9937 14.398 16.1249 14.0192 16.1249H3.98077ZM3.98077 15H14.0192C14.0769 15 14.1298 14.9759 14.1779 14.9279C14.2259 14.8798 14.25 14.8269 14.25 14.7692V7.73076H3.74998V14.7692C3.74998 14.8269 3.77402 14.8798 3.82209 14.9279C3.87018 14.9759 3.92308 15 3.98077 15ZM8.99998 10.5577C8.81633 10.5577 8.65984 10.493 8.53052 10.3637C8.40119 10.2343 8.33653 10.0779 8.33653 9.89421C8.33653 9.71056 8.40119 9.55407 8.53052 9.42475C8.65984 9.29542 8.81633 9.23076 8.99998 9.23076C9.18363 9.23076 9.34012 9.29542 9.46944 9.42475C9.59877 9.55407 9.66343 9.71056 9.66343 9.89421C9.66343 10.0779 9.59877 10.2343 9.46944 10.3637C9.34012 10.493 9.18363 10.5577 8.99998 10.5577ZM5.99998 10.5577C5.81633 10.5577 5.65984 10.493 5.53052 10.3637C5.40119 10.2343 5.33653 10.0779 5.33653 9.89421C5.33653 9.71056 5.40119 9.55407 5.53052 9.42475C5.65984 9.29542 5.81633 9.23076 5.99998 9.23076C6.18363 9.23076 6.34012 9.29542 6.46944 9.42475C6.59877 9.55407 6.66343 9.71056 6.66343 9.89421C6.66343 10.0779 6.59877 10.2343 6.46944 10.3637C6.34012 10.493 6.18363 10.5577 5.99998 10.5577ZM12 10.5577C11.8163 10.5577 11.6598 10.493 11.5305 10.3637C11.4012 10.2343 11.3365 10.0779 11.3365 9.89421C11.3365 9.71056 11.4012 9.55407 11.5305 9.42475C11.6598 9.29542 11.8163 9.23076 12 9.23076C12.1836 9.23076 12.3401 9.29542 12.4694 9.42475C12.5988 9.55407 12.6634 9.71056 12.6634 9.89421C12.6634 10.0779 12.5988 10.2343 12.4694 10.3637C12.3401 10.493 12.1836 10.5577 12 10.5577ZM8.99998 13.5C8.81633 13.5 8.65984 13.4353 8.53052 13.306C8.40119 13.1767 8.33653 13.0202 8.33653 12.8365C8.33653 12.6529 8.40119 12.4964 8.53052 12.3671C8.65984 12.2377 8.81633 12.173 8.99998 12.173C9.18363 12.173 9.34012 12.2377 9.46944 12.3671C9.59877 12.4964 9.66343 12.6529 9.66343 12.8365C9.66343 13.0202 9.59877 13.1767 9.46944 13.306C9.34012 13.4353 9.18363 13.5 8.99998 13.5ZM5.99998 13.5C5.81633 13.5 5.65984 13.4353 5.53052 13.306C5.40119 13.1767 5.33653 13.0202 5.33653 12.8365C5.33653 12.6529 5.40119 12.4964 5.53052 12.3671C5.65984 12.2377 5.81633 12.173 5.99998 12.173C6.18363 12.173 6.34012 12.2377 6.46944 12.3671C6.59877 12.4964 6.66343 12.6529 6.66343 12.8365C6.66343 13.0202 6.59877 13.1767 6.46944 13.306C6.34012 13.4353 6.18363 13.5 5.99998 13.5ZM12 13.5C11.8163 13.5 11.6598 13.4353 11.5305 13.306C11.4012 13.1767 11.3365 13.0202 11.3365 12.8365C11.3365 12.6529 11.4012 12.4964 11.5305 12.3671C11.6598 12.2377 11.8163 12.173 12 12.173C12.1836 12.173 12.3401 12.2377 12.4694 12.3671C12.5988 12.4964 12.6634 12.6529 12.6634 12.8365C12.6634 13.0202 12.5988 13.1767 12.4694 13.306C12.3401 13.4353 12.1836 13.5 12 13.5Z" fill="#18181B" />
          </svg>
          <h1>이번 달 학사일정</h1>
        </div>
        <Link href="/schoolschedules">
          더보기
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9.70974 8.99999L6.65494 5.94516C6.55109 5.84133 6.49796 5.7108 6.49556 5.55359C6.49315 5.39639 6.54628 5.26346 6.65494 5.15481C6.76359 5.04615 6.89531 4.99182 7.05011 4.99182C7.20491 4.99182 7.33664 5.04615 7.44529 5.15481L10.816 8.52548C10.8862 8.59567 10.9357 8.66971 10.9645 8.7476C10.9934 8.82547 11.0078 8.9096 11.0078 8.99999C11.0078 9.09038 10.9934 9.17451 10.9645 9.25238C10.9357 9.33027 10.8862 9.40431 10.816 9.4745L7.44529 12.8452C7.34145 12.949 7.21092 13.0021 7.05371 13.0045C6.89651 13.007 6.76359 12.9538 6.65494 12.8452C6.54628 12.7365 6.49194 12.6048 6.49194 12.45C6.49194 12.2952 6.54628 12.1635 6.65494 12.0548L9.70974 8.99999Z" fill="#71717A" />
          </svg>
        </Link>
      </WrapScheduleTitle>
      <h2>오늘</h2>
      {todayEvents.length > 0 ? (
        <ul>
          {todayEvents.map((event, index) => (
            <li key={index}>{`${event.DISPLAY_DATE} - ${event.EVENT_NM}`}</li>
          ))}
        </ul>
      ) : <p>학사 일정이 없어요.</p>}
      <h2>다가오는 일정</h2>
      {upcomingEvents.length > 0 ? (
        <ul>
          {upcomingEvents.map((event, index) => (
            <li key={index}>{`${event.DISPLAY_DATE} - ${event.EVENT_NM} `}</li>
          ))}
        </ul>
      ) : (
        <p>다가오는 일정이 없습니다.</p>
      )}
    </WrapSchoolScheduleContainer>
  );
};

export default EducationSchedules;