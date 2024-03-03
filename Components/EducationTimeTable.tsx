"use client";

import React, { useState, useEffect } from "react";
import { ClassInfoResponse } from "@/interfaces/Interface";

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
  const [timeTable, setTimeTable] = useState<TimeTableData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection>({ GRADE: "1", CLASS_NM: "1" });
  const [availableClasses, setAvailableClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
        const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
        const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
        const currentYear = new Date().getFullYear().toString();

        const today: Date = new Date();
        const todayStr: string = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;

        const responseMisTimetable = await fetch(
          `/api/education?endpoint=misTimetable&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&ALL_TI_YMD=${todayStr}&GRADE=${selection.GRADE}&CLASS_NM=${selection.CLASS_NM}`
        );

        const responseClassInfo = await fetch(
          `/api/education?endpoint=classInfo&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AY=${currentYear}`
        );

        if (!responseMisTimetable.ok || !responseClassInfo.ok) {
          throw new Error('Failed to fetch data');
        }

        const misTimetableData = await responseMisTimetable.json();
        const classInfoData = await responseClassInfo.json();

        // 시간표 데이터 필터링 및 상태 업데이트
        const filteredTimeTable = misTimetableData.misTimetable[1].row.filter((item: TimeTableData) => item.ALL_TI_YMD === todayStr && item.GRADE === selection.GRADE && item.CLASS_NM === selection.CLASS_NM);
        setTimeTable(filteredTimeTable);

        // 현재 년도에 해당하는 클래스 정보를 사용하여 선택 가능한 학년과 반 업데이트
        const classes = classInfoData.classInfo[1].row
          .filter((item: ClassInfoResponse) => item.AY === currentYear) // 현재 년도에 해당하는 데이터만 필터링
          .map((item: ClassInfoResponse) => ({ GRADE: item.GRADE.toString(), CLASS_NM: item.CLASS_NM.toString() }));
        setAvailableClasses(classes);

      } catch (error) {
        setError("시간표를 준비 중이에요. 잠시만 기다려주세요.");
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
                {grade}학년
              </option>
            ))}
        </select>
        <label>반: </label>
        <select value={selection.CLASS_NM} onChange={handleClassChange}>
          {availableClasses
            .filter((cls) => cls.GRADE === selection.GRADE)
            .map((cls, index) => (
              <option key={`${cls.GRADE}-${cls.CLASS_NM}-${index}`} value={cls.CLASS_NM}>
                {cls.CLASS_NM}반
              </option>
            ))}
        </select>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
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


