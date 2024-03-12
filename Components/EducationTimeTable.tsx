"use client";

import React, { useEffect } from "react";
import { useTimeTableStore } from "@/app/Store/timeTableStore";
import styled from "@emotion/styled";
import Link from "next/link";

const TimeTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
`;

const EducationTimeTable = () => {
  const {
    timeTable,
    isLoading,
    selection,
    availableClasses,
    setTimeTable,
    setIsLoading,
    setSelection,
    setAvailableClasses,
  } = useTimeTableStore();
  useEffect(() => {
    const storedSelection = localStorage.getItem("selection");
    if (storedSelection) {
      const selectionObj = JSON.parse(storedSelection);
      setSelection(selectionObj);
    }
  }, [setSelection]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // 환경 변수에서 필요한 정보를 불러옵니다.
        const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
        const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
        const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
        const currentYear: string = new Date().getFullYear().toString();

        // 현재 날짜를 YYMMDD 형식으로 변환합니다.
        const today: Date = new Date();
        const todayStr: string = `${today.getFullYear()}${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;

        // classInfo 데이터를 불러옵니다.
        const responseClassInfo: Response = await fetch(
          `/api/education?endpoint=classInfo&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AY=${currentYear}`
        );

        if (!responseClassInfo.ok) {
          throw new Error("Failed to fetch classInfo data");
        }

        const classInfoData = await responseClassInfo.json();

        // 현재 년도에 해당하는 데이터만 필터링합니다.
        const validClasses: [] = classInfoData.classInfo[1].row
          .filter((item: { AY: string }) => item.AY === currentYear)
          .map(
            (item: {
              GRADE: { toString: () => any };
              CLASS_NM: { toString: () => any };
            }) => ({
              GRADE: item.GRADE.toString(),
              CLASS_NM: item.CLASS_NM.toString(),
            })
          );

        setAvailableClasses(validClasses);

        // 선택된 학년과 반에 대한 시간표 데이터를 불러옵니다.
        const responseMisTimetable: Response = await fetch(
          `/api/education?endpoint=misTimetable&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&ALL_TI_YMD=${todayStr}&GRADE=${selection.GRADE}&CLASS_NM=${selection.CLASS_NM}`
        );

        if (!responseMisTimetable.ok) {
          throw new Error("Failed to fetch misTimetable data");
        }

        const misTimetableData = await responseMisTimetable.json();

        // 시간표 데이터를 필터링하여 상태를 업데이트합니다.
        const filteredTimeTable = misTimetableData.misTimetable[1].row.filter(
          (item: { ALL_TI_YMD: string; GRADE: string; CLASS_NM: string }) =>
            item.ALL_TI_YMD === todayStr &&
            item.GRADE === selection.GRADE &&
            item.CLASS_NM === selection.CLASS_NM
        );

        setTimeTable(filteredTimeTable.length > 0 ? filteredTimeTable : null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selection.GRADE && selection.CLASS_NM) {
      fetchData();
    }
  }, [selection, setIsLoading, setTimeTable, setAvailableClasses]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newSelection = { ...selection, GRADE: e.target.value };
    setSelection(newSelection);
    localStorage.setItem("selection", JSON.stringify(newSelection));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelection = { ...selection, CLASS_NM: e.target.value };
    setSelection(newSelection);
    localStorage.setItem("selection", JSON.stringify(newSelection));
  };

  return (
    <TimeTableContainer>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M10.6145 6.74998C10.4218 6.74998 10.2608 6.68532 10.1315 6.55599C10.0022 6.42667 9.9375 6.26418 9.9375 6.06853V3.30645C9.9375 3.11081 10.0027 2.94833 10.133 2.81901C10.2634 2.68967 10.4249 2.625 10.6176 2.625H14.698C14.8906 2.625 15.0516 2.68967 15.181 2.81901C15.3103 2.94833 15.375 3.11081 15.375 3.30645V6.06853C15.375 6.26418 15.3098 6.42667 15.1794 6.55599C15.0491 6.68532 14.8876 6.74998 14.6949 6.74998H10.6145ZM3.30201 9.37496C3.10933 9.37496 2.94833 9.31027 2.81901 9.18088C2.68967 9.05151 2.625 8.89119 2.625 8.69994V3.29987C2.625 3.10862 2.69017 2.94833 2.82052 2.81901C2.95087 2.68967 3.11239 2.625 3.30508 2.625H7.38546C7.57814 2.625 7.73915 2.68969 7.86848 2.81908C7.9978 2.94846 8.06246 3.10877 8.06246 3.30002V8.70009C8.06246 8.89134 7.99729 9.05163 7.86696 9.18096C7.73661 9.31029 7.57509 9.37496 7.3824 9.37496H3.30201ZM10.6145 15.375C10.4218 15.375 10.2608 15.3103 10.1315 15.1809C10.0022 15.0515 9.9375 14.8912 9.9375 14.6999V9.29987C9.9375 9.10862 10.0027 8.94833 10.133 8.81901C10.2634 8.68967 10.4249 8.625 10.6176 8.625H14.698C14.8906 8.625 15.0516 8.68969 15.181 8.81908C15.3103 8.94846 15.375 9.10877 15.375 9.30002V14.7001C15.375 14.8913 15.3098 15.0516 15.1794 15.181C15.0491 15.3103 14.8876 15.375 14.6949 15.375H10.6145ZM3.30201 15.375C3.10933 15.375 2.94833 15.3103 2.81901 15.181C2.68967 15.0516 2.625 14.8892 2.625 14.6935V11.9314C2.625 11.7358 2.69017 11.5733 2.82052 11.444C2.95087 11.3146 3.11239 11.25 3.30508 11.25H7.38546C7.57814 11.25 7.73915 11.3146 7.86848 11.444C7.9978 11.5733 8.06246 11.7358 8.06246 11.9314V14.6935C8.06246 14.8892 7.99729 15.0516 7.86696 15.181C7.73661 15.3103 7.57509 15.375 7.3824 15.375H3.30201Z"
          fill="black"
        />
      </svg>
      <h1>오늘의 시간표</h1>
      <Link href="/timetable">
          더보기
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9.70974 8.99999L6.65494 5.94516C6.55109 5.84133 6.49796 5.7108 6.49556 5.55359C6.49315 5.39639 6.54628 5.26346 6.65494 5.15481C6.76359 5.04615 6.89531 4.99182 7.05011 4.99182C7.20491 4.99182 7.33664 5.04615 7.44529 5.15481L10.816 8.52548C10.8862 8.59567 10.9357 8.66971 10.9645 8.7476C10.9934 8.82547 11.0078 8.9096 11.0078 8.99999C11.0078 9.09038 10.9934 9.17451 10.9645 9.25238C10.9357 9.33027 10.8862 9.40431 10.816 9.4745L7.44529 12.8452C7.34145 12.949 7.21092 13.0021 7.05371 13.0045C6.89651 13.007 6.76359 12.9538 6.65494 12.8452C6.54628 12.7365 6.49194 12.6048 6.49194 12.45C6.49194 12.2952 6.54628 12.1635 6.65494 12.0548L9.70974 8.99999Z" fill="#71717A" />
          </svg>
        </Link>
      <div>
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
        <label> 학년 </label>
        <select value={selection.CLASS_NM} onChange={handleClassChange}>
          {availableClasses
            .filter((cls) => cls.GRADE === selection.GRADE)
            .map((cls, index) => (
              <option
                key={`${cls.GRADE}-${cls.CLASS_NM}-${index}`}
                value={cls.CLASS_NM}
              >
                {cls.CLASS_NM}
              </option>
            ))}
        </select>
        <label> 반 </label>
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
    </TimeTableContainer>
  );
};

export default EducationTimeTable;
