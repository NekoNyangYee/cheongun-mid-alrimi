"use client";

import React, { useState, useEffect } from "react";
import { ClassInfoResponse } from "@/interfaces/Interface";
import { useTimeTableStore } from "@/app/Store/timeTableStore";

interface TimeTableData {
  PERIO: string;
  ITRT_CNTNT: string;
  ALL_TI_YMD: string;
  GRADE: string;
  CLASS_NM: string;
}

interface Selection {
  GRADE: string;
  CLASS_NM: string;
}

interface ClassInfo {
  GRADE: string;
  CLASS_NM: string;
}

const EducationTimeTable = () => {
  const { timeTable, isLoading, selection, availableClasses, setTimeTable, setIsLoading, setSelection, setAvailableClasses } = useTimeTableStore();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 환경 변수에서 필요한 정보를 불러옵니다.
        const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
        const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
        const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
        const currentYear = new Date().getFullYear().toString();

        // 현재 날짜를 YYMMDD 형식으로 변환합니다.
        const today = new Date();
        const todayStr = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

        // classInfo 데이터를 불러옵니다.
        const responseClassInfo = await fetch(`/api/education?endpoint=classInfo&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AY=${currentYear}`);

        if (!responseClassInfo.ok) {
          throw new Error('Failed to fetch classInfo data');
        }

        const classInfoData = await responseClassInfo.json();

        // 현재 년도에 해당하는 데이터만 필터링합니다.
        const validClasses = classInfoData.classInfo[1].row
          .filter((item: { AY: string; }) => item.AY === currentYear)
          .map((item: { GRADE: { toString: () => any; }; CLASS_NM: { toString: () => any; }; }) => ({ GRADE: item.GRADE.toString(), CLASS_NM: item.CLASS_NM.toString() }));

        setAvailableClasses(validClasses);

        // 선택된 학년과 반에 대한 시간표 데이터를 불러옵니다.
        const responseMisTimetable = await fetch(`/api/education?endpoint=misTimetable&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&ALL_TI_YMD=${todayStr}&GRADE=${selection.GRADE}&CLASS_NM=${selection.CLASS_NM}`);

        if (!responseMisTimetable.ok) {
          throw new Error('Failed to fetch misTimetable data');
        }

        const misTimetableData = await responseMisTimetable.json();

        // 시간표 데이터를 필터링하여 상태를 업데이트합니다.
        const filteredTimeTable = misTimetableData.misTimetable[1].row.filter((item: { ALL_TI_YMD: string; GRADE: string; CLASS_NM: string; }) => item.ALL_TI_YMD === todayStr && item.GRADE === selection.GRADE && item.CLASS_NM === selection.CLASS_NM);

        setTimeTable(filteredTimeTable.length > 0 ? filteredTimeTable : null);

      } catch (error) {
        console.error(error);
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

  return (
    <div>
      <h1>오늘의 시간표</h1>
      <div>
        <label>학년: </label>
        <select value={selection.GRADE} onChange={handleGradeChange}>
          {availableClasses
            .map((cls) => cls.GRADE)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
        </select>
        <label>반: </label>
        <select value={selection.CLASS_NM} onChange={handleClassChange}>
          {availableClasses
            .filter((cls) => cls.GRADE === selection.GRADE)
            .map((cls, index) => (
              <option key={`${cls.GRADE}-${cls.CLASS_NM}-${index}`} value={cls.CLASS_NM}>
                {cls.CLASS_NM}
              </option>
            ))}
        </select>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : timeTable.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>교시</th>
              <th>시간표</th>
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
        <p>오늘은 시간표가 없습니다.</p>
      )}
    </div>
  );
};

export default EducationTimeTable;


