"use client"

import React, { useEffect } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useTimeTableStore } from "../Store/timeTableStore";
import { API_KEY, OFFICE_CODE, SCHOOL_CODE } from "../utils/constants";

const WrapDetailedContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 16px;

    & .detailed-timetable-title {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: flex-start;

        & h1 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        & img {
            width: 24px;
            height: 24px;
        }
    }
`;

const InfoSentence = styled.p`
    color: #71717A;
    font-size: 0.9rem;
    margin: 0;
`;

const WeekGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    margin-top: 20px;
`;

const DayContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    height: 500px;
    padding: 1rem;
    border-radius: 8px;
`;

const DayHeader = styled.p`
    width: 100%;
    font-size: 1.2rem;
    margin: 0;
`;

const PeriodContainer = styled.td`
  padding: 8px;
  border: 1px solid transparent;
  text-align: center;
`;

const ClassContainer = styled.td`
  width: 80%;
  text-align: center;
  background-color: #F4F4F5;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
`;

const SelectGradeClassNMContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-start;

    & label {
        font-size: 1rem;
        color: #71717A;
    }

`;

const SelectOption = styled.select`
  padding: 8px 16px;
  background-color: #f4f4f5;
  border: 1px solid #e4e4e7;
  border-radius: 4px;
  color: #71717A;
  cursor: pointer;
  font-size: 0.8rem;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 1.5em auto, 100%;
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
        const currentDate: Date = new Date(date);
        const weekDay: number = currentDate.getDay();
        const diffToMonday: number = currentDate.getDate() - weekDay + (weekDay === 0 ? -6 : 1);
        const monday: Date = new Date(currentDate.setDate(diffToMonday));
        const friday: Date = new Date(monday);
        friday.setDate(monday.getDate() + 4);

        return { start: monday, end: friday };
    }


    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const currentYear: string = new Date().getFullYear().toString();

                const today: Date = new Date();
                const { start, end } = getWeekStartAndEnd(today);

                const formatDate = (date: Date) => {
                    return `${date.getFullYear()}${(date.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
                };

                const startStr: string = formatDate(start);
                const endStr: string = formatDate(end);

                const responseClassInfo: Response = await fetch(
                    `/api/education?endpoint=classInfo&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AY=${currentYear}`
                );

                if (!responseClassInfo.ok) {
                    throw new Error("Failed to fetch classInfo data");
                }

                const classInfoData = await responseClassInfo.json();
                const validClasses = classInfoData.classInfo[1].row.filter((item: { AY: string; }) => item.AY === currentYear);

                setAvailableClasses(validClasses);
                // 요청 범위를 현재 주의 월요일부터 금요일까지로 설정합니다.
                const responseDetailedTimetable: Response = await fetch(
                    `/api/education?endpoint=misTimetable&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&GRADE=${selection.GRADE}&CLASS_NM=${selection.CLASS_NM}&TI_FROM_YMD=${startStr}&TI_TO_YMD=${endStr}`
                );

                if (!responseDetailedTimetable.ok) {
                    throw new Error("Failed to fetch timetable data");
                }

                const timetableData = await responseDetailedTimetable.json();

                const filteredTimeTable = timetableData.misTimetable[1].row.filter((item: { ALL_TI_YMD: any; GRADE: string; CLASS_NM: string; }) =>
                    Number(item.ALL_TI_YMD) >= Number(startStr) && Number(item.ALL_TI_YMD) <= Number(endStr) &&
                    item.GRADE === selection.GRADE && item.CLASS_NM === selection.CLASS_NM
                );

                setTimeTable(filteredTimeTable);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        setAvailableClasses([]);
        setTimeTable([]);
        setIsLoading(true);
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
        const month: string = dateStr.substring(4, 6);
        const day: string = dateStr.substring(6, 8);

        return `${parseInt(month)}월 ${parseInt(day)}일`;
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelection({ ...selection, GRADE: e.target.value });
    };

    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelection({ ...selection, CLASS_NM: e.target.value });
    };

    return (
        <WrapDetailedContainer>
            <div className="detailed-timetable-title">
                <Image src="/timetable.svg" alt="timetable" width={24} height={24} />
                <h1>시간표 조회</h1>
            </div>
            <InfoSentence>월요일부터 금요일까지의 일주일간의 시간표에요. <br /> 세부 시간표는 학급의 사정에 따라 변경될 수 있어요.</InfoSentence>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <SelectGradeClassNMContainer>
                        <Image src="/cog.svg" width={24} height={24} alt="시간표" />

                        <SelectOption value={selection.GRADE} onChange={handleGradeChange}>
                            {availableClasses.map((cls) => cls.GRADE).filter((value, index, self) => self.indexOf(value) === index).map((grade) => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </SelectOption>
                        <label htmlFor="grade-select">학년</label>
                        <SelectOption value={selection.CLASS_NM} onChange={handleClassChange}>
                            {availableClasses.filter((cls) => cls.GRADE === selection.GRADE).map((cls, index) => (
                                <option key={index} value={cls.CLASS_NM}>{cls.CLASS_NM}</option>
                            ))}
                        </SelectOption>
                        <label htmlFor="class-select">반</label>
                    </SelectGradeClassNMContainer>
                    <WeekGrid>
                        {Object.keys(timetableByDate).map((date) => (
                            <DayContainer key={date}>
                                <DayHeader>{formatDate(date)}</DayHeader>
                                <table>
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
        </WrapDetailedContainer>
    );
}