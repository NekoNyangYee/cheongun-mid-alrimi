"use client"

import React, { useEffect } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useTimeTableStore } from "../Store/timeTableStore";

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); // 5일(월~금)에 대해 그리드를 설정합니다.
  gap: 16px; // 그리드 사이의 간격입니다.
  margin-top: 20px;
`;

const DayContainer = styled.div`
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 8px;
`;

const DayHeader = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

const PeriodContainer = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
`;

const ClassContainer = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
`;

export const DetailedTimetablePage = () => {
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

    const getWeekStartAndEnd = (date: Date) => {
        const currentDate = new Date(date);
        const weekDay = currentDate.getDay();
        const diffToMonday = currentDate.getDate() - weekDay + (weekDay === 0 ? -6 : 1);
        const monday = new Date(currentDate.setDate(diffToMonday));
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);

        return { start: monday, end: friday };
    }


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            setIsLoading(true);
            try {
                // 환경 변수에서 필요한 정보를 불러옵니다.
                const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
                const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
                const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
                const currentYear: string = new Date().getFullYear().toString();

                const today = new Date();
                const { start, end } = getWeekStartAndEnd(today);

                const formatDate = (date: Date) => {
                    return `${date.getFullYear()}${(date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
                };

                const startStr = formatDate(start);
                const endStr = formatDate(end);

                // classInfo 데이터를 불러옵니다.
                const responseClassInfo = await fetch(
                    `/api/education?endpoint=classInfo&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AY=${currentYear}`
                );

                if (!responseClassInfo.ok) {
                    throw new Error("Failed to fetch classInfo data");
                }

                const classInfoData = await responseClassInfo.json();
                // 현재 년도에 해당하는 클래스 정보 필터링
                const validClasses = classInfoData.classInfo[1].row.filter((item: { AY: string; }) => item.AY === currentYear);

                setAvailableClasses(validClasses);

                // 시간표 데이터를 불러오기 위해 수정된 요청 URL을 사용합니다.
                // 요청 범위를 현재 주의 월요일부터 금요일까지로 설정합니다.
                const responseTimetable = await fetch(
                    `/api/education?endpoint=misTimetable&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&GRADE=${selection.GRADE}&CLASS_NM=${selection.CLASS_NM}&TI_FROM_YMD=${startStr}&TI_TO_YMD=${endStr}`
                );

                if (!responseTimetable.ok) {
                    throw new Error("Failed to fetch timetable data");
                }

                const timetableData = await responseTimetable.json();

                const filteredTimeTable = timetableData.misTimetable[1].row.filter((item: { ALL_TI_YMD: any; GRADE: string; CLASS_NM: string; }) =>
                    Number(item.ALL_TI_YMD) >= Number(startStr) && Number(item.ALL_TI_YMD) <= Number(endStr) &&
                    item.GRADE === selection.GRADE && item.CLASS_NM === selection.CLASS_NM
                );

                // API 응답에서 시간표 데이터를 추출하고 상태를 업데이트합니다.
                setTimeTable(filteredTimeTable);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selection, setIsLoading, setTimeTable, setAvailableClasses]);

    const timetableByDate = timeTable.reduce<Record<string, any[]>>((acc, curr) => {
        const date = curr.ALL_TI_YMD;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
    }, {});

    // 날짜를 '월-일' 형식으로 변환하는 함수
    const formatDate = (dateStr: string) => {
        // YYYYMMDD 형식의 문자열을 가정합니다.
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);

        return `${parseInt(month)}월 ${parseInt(day)}일`;
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelection({ ...selection, GRADE: e.target.value });
    };

    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelection({ ...selection, CLASS_NM: e.target.value });
    };

    return (
        <>
            <h1>시간표 조회</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Image src="/cog.svg" width={24} height={24} alt="시간표" />
                    <div>
                        <label htmlFor="grade-select">학년:</label>
                        <select id="grade-select" value={selection.GRADE} onChange={handleGradeChange}>
                            <option value="">선택하세요</option>
                            {availableClasses.map((cls) => cls.GRADE).filter((value, index, self) => self.indexOf(value) === index).map((grade) => (
                                <option key={grade} value={grade}>{grade}학년</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="class-select">반:</label>
                        <select id="class-select" value={selection.CLASS_NM} onChange={handleClassChange}>
                            <option value="">선택하세요</option>
                            {availableClasses.filter((cls) => cls.GRADE === selection.GRADE).map((cls, index) => (
                                <option key={index} value={cls.CLASS_NM}>{cls.CLASS_NM}반</option>
                            ))}
                        </select>
                    </div>
                    <WeekGrid>
                        {Object.keys(timetableByDate).map((date) => (
                            <DayContainer key={date}>
                                <DayHeader>{formatDate(date)}</DayHeader>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>교시</th>
                                            <th>수업 내용</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timetableByDate[date].map((item, index) => (
                                            <tr key={index}>
                                                <PeriodContainer>{item.PERIO}</PeriodContainer>
                                                <ClassContainer>{item.ITRT_CNTNT}</ClassContainer>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </DayContainer>
                        ))}
                    </WeekGrid>
                </>
            )}
        </>
    );
}