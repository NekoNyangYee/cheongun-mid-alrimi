"use client"

import React, { useState, useEffect } from "react";
import EducationTimeTable from "./EducationTimeTable";
import SchoolTimeTable from "./EducationTimeTable";

// 필요한 데이터 필드만을 포함하는 인터페이스를 정의합니다.
interface EventData {
  EVENT_NM: string;
  AA_YMD: string;
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

        const response = await fetch(`/api/education?endpoint=SchoolSchedule&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}`);
        if (!response.ok) {
          throw new Error('데이터를 불러오는 중에 오류가 발생했습니다.');
        }
        const data = await response.json();

        const formatDate = (dateStr: string): string => {
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          return `${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
        };

        const extractedData = data.SchoolSchedule[1].row.map((event: any) => ({
          EVENT_NM: event.EVENT_NM,
          AA_YMD: formatDate(event.AA_YMD),
        }));

        const ay = data.SchoolSchedule[1].row[0]?.AY;
        setAcademicYear(ay);

        setEvents(extractedData);
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
      <h1>School Events {academicYear}</h1>
      {events.length > 0 ? (
        <ul>
          {events.map((event, index) => (
            <li key={index}>{`${event.EVENT_NM} - ${event.AA_YMD}`}</li>
          ))}
        </ul>
      ) : <p>표시 할 학사일정이 없습니다.</p>}
      <EducationTimeTable />
    </div>
  );
};

export default EducationSchedules;