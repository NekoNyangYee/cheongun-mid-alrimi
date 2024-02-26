"use client";

import React, { useState, useEffect } from "react";
import EducationTimeTable from "./EducationTimeTable";

interface EventData {
  EVENT_NM: string;
  AA_YMD: string; // 'YYYYMMDD' 형식
}

const EducationSchedules: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [academicYear, setAcademicYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
        const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
        const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
        const currentYear = new Date().getFullYear(); // 현재 년도
        const currentMonth = new Date().getMonth() + 1; // 현재 월
        const startDateOfYear = `${currentYear}`;
        const response = await fetch(`/api/education?endpoint=SchoolSchedule&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AA_YMD=${startDateOfYear}`);


        if (!response.ok) {
          throw new Error('데이터를 불러오는 중에 오류가 발생했습니다.');
        }
        const data = await response.json();

        // 현재 년도에 해당하는 이벤트만 필터링
        const filteredEvents = data.SchoolSchedule[1].row.filter((event: any) => event.AA_YMD.startsWith(currentYear)).map((event: any) => ({
          EVENT_NM: event.EVENT_NM,
          AA_YMD: `${event.AA_YMD.substring(0, 4)}년 ${parseInt(event.AA_YMD.substring(4, 6), 10)}월 ${parseInt(event.AA_YMD.substring(6), 10)}일`,
        })).filter((event: any) => event.AA_YMD.substring(0, 4) === startDateOfYear && parseInt(event.AA_YMD.substring(5, 7), 10) === currentMonth);

        setEvents(filteredEvents);
        setAcademicYear(startDateOfYear); // academicYear를 현재 년도로 설정
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
      <h1>School Events for {academicYear}</h1>
      {events.length > 0 ? (
        <ul>
          {events.map((event, index) => (
            <li key={index}>{`${event.EVENT_NM} - ${event.AA_YMD}`}</li>
          ))}
        </ul>
      ) : <p>올해 표시할 학사일정이 없습니다.</p>}
      <EducationTimeTable />
    </div>
  );
};

export default EducationSchedules;

