"use client";

import React, { useState, useEffect } from "react";

// 시간표 데이터 타입 정의
interface TimeTableData {
  PERIO: string; // 교시
  ITRT_CNTNT: string; // 수업 내용
  ALL_TI_YMD: string; // 날짜
  GRADE: string; // 학년
  CLASS_NM: string; // 반
}

// 선택 가능한 학년과 반의 타입 정의
interface Selection {
  GRADE: string;
  CLASS_NM: string;
}

const EducationTimeTable: React.FC = () => {
  const [timeTable, setTimeTable] = useState<TimeTableData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection>({ GRADE: "1", CLASS_NM: "1" }); // 기본 선택은 1학년 1반

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
        const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
        const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;

        // 현재 날짜를 'YYYYMMDD' 형식으로 구하기
        const today = new Date();
        const todayStr = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

        const response = await fetch(
          `/api/education?endpoint=misTimetable&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&ALL_TI_YMD=${todayStr}&GRADE=${selection.GRADE}&CLASS_NM=${selection.CLASS_NM}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        // 현재 날짜(`ALL_TI_YMD`)에 해당하며 선택된 학년과 반에 해당하는 시간표 데이터만 필터링하여 저장
        const filteredTimeTable = data.misTimetable[1].row.filter((item: TimeTableData) => item.ALL_TI_YMD === todayStr && item.GRADE === selection.GRADE && item.CLASS_NM === selection.CLASS_NM);
        setTimeTable(filteredTimeTable);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selection]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection({ ...selection, GRADE: e.target.value });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection({ ...selection, CLASS_NM: e.target.value });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Today's Time Table for Grade {selection.GRADE}, Class {selection.CLASS_NM}</h1>
      <div>
        <label>Grade: </label>
        <select value={selection.GRADE} onChange={handleGradeChange}>
          {/* 예시로 1학년부터 3학년까지 옵션 제공 */}
          {[1, 2, 3].map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        <label>Class: </label>
        <select value={selection.CLASS_NM} onChange={handleClassChange}>
          {/* 예시로 1반부터 8반까지 옵션 제공 */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((classNm) => (
            <option key={classNm} value={classNm}>
              {classNm}
            </option>
          ))}
        </select>
      </div>
      {timeTable.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {timeTable.map((item, index) => (
              <tr key={index}>
                <td>{item.PERIO}</td>
                <td>{item.ITRT_CNTNT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No time table for today.</p>
      )}
    </div>
  );
};

export default EducationTimeTable;
