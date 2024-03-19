"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import { useTimeTableStore } from "../Store/timeTableStore";
import { API_KEY, OFFICE_CODE, SCHOOL_CODE } from "../utils/constants";

const WrapTimeTableMainContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  margin: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const WrapDetailedContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

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
  color: #71717a;
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
  gap: 1rem;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
`;

const DayHeader = styled.p`
  width: 100%;
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
`;

const PeriodContainer = styled.td`
  padding: 8px;
  border: 1px solid transparent;
  text-align: center;
`;

const ClassContainer = styled.td`
  width: 80%;
  text-align: center;
  background-color: #f4f4f5;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
`;

const SelectGradeClassNMContainer = styled.div`
  display: flex;
  width: 40%;
  flex-direction: column;
  margin: 20px 0;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;

  & .select-grade {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  & label {
    font-size: 1rem;
    color: #71717a;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SelectOption = styled.select`
  padding: 8px 16px;
  background-color: #f4f4f5;
  border: 1px solid #e4e4e7;
  border-radius: 4px;
  color: #71717a;
  cursor: pointer;
  font-size: 0.8rem;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 1.5em auto, 100%;
`;

const DateButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  width: 100%;

  @media (max-width: 768px) {
    display: flex;
    height: auto;
    overflow-x: auto;
    padding: 8px 0;
  }
`;

const DateButton = styled.button<{ isActive: boolean }>`
  white-space: nowrap;
  padding: 16px;
  border: none;
  background-color: ${(props) => (props.isActive ? "#000000" : "#EFEFEF")};
  color: ${(props) => (props.isActive ? "#FFFFFF" : "#000000")};
  border-radius: 8px;
  cursor: pointer;
`;

const SelectGradeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & h2 {
    margin: 0;
    font-size: 1.2rem;
  }
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

  const [selectedDate, setSelectedDate] = useState("");

  const getWeekStartAndEnd = (date: Date) => {
    const currentDate: Date = new Date(date);
    const weekDay: number = currentDate.getDay();
    const diffToMonday: number =
      currentDate.getDate() - weekDay + (weekDay === 0 ? -6 : 1);
    const monday: Date = new Date(currentDate.setDate(diffToMonday));
    const friday: Date = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return { start: monday, end: friday };
  };

  const getWeekDays = (baseDate: Date) => {
    const date = new Date(baseDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

    return Array.from({ length: 5 }, (_, i) => {
      const newDate = new Date(date.getFullYear(), date.getMonth(), diff + i);
      return formatDateToYYYYMMDD(newDate);
    });
  };

  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const formatToDay = (dateStr: any) => {
    const [year, month, day] = [
      dateStr.substring(0, 4),
      dateStr.substring(4, 6) - 1,
      dateStr.substring(6, 8),
    ];
    const date: Date = new Date(year, month, day);
    return date.toLocaleDateString("ko-KR", { weekday: "long" });
  };

  const weekDays: Array<string> = getWeekDays(new Date());

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const currentYear: string = new Date().getFullYear().toString();
        // 현재 날짜를 YYYYMMDD 형식으로 포맷팅하는 로직
        const todayFormatted: string = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        setSelectedDate(todayFormatted);

        const today: Date = new Date();
        const { start, end } = getWeekStartAndEnd(today);

        const formatDate = (date: Date) => {
          return `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
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
        const validClasses = classInfoData.classInfo[1].row.filter(
          (item: { AY: string }) => item.AY === currentYear
        );

        setAvailableClasses(validClasses);
        // 요청 범위를 현재 주의 월요일부터 금요일까지로 설정합니다.
        const responseDetailedTimetable: Response = await fetch(
          `/api/education?endpoint=misTimetable&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&GRADE=${selection.GRADE}&CLASS_NM=${selection.CLASS_NM}&TI_FROM_YMD=${startStr}&TI_TO_YMD=${endStr}`
        );

        if (!responseDetailedTimetable.ok) {
          throw new Error("Failed to fetch timetable data");
        }

        const timetableData = await responseDetailedTimetable.json();

        const eventTimetable = timetableData.misTimetable[1].row;
        const filteredTimeTable: [] = eventTimetable.filter(
          (item: { ALL_TI_YMD: any; GRADE: string; CLASS_NM: string }) =>
            Number(item.ALL_TI_YMD) >= Number(startStr) &&
            Number(item.ALL_TI_YMD) <= Number(endStr) &&
            item.GRADE === selection.GRADE &&
            item.CLASS_NM === selection.CLASS_NM
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

  const timetableByDate: Record<string, any[]> = timeTable.reduce<
    Record<string, any[]>
  >((acc, curr) => {
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
    const newGrade = e.target.value;
    // 새로운 학년에 따른 반 목록 필터링
    const classesInNewGrade = availableClasses.filter(
      (cls) => cls.GRADE === newGrade
    );

    // 클래스 목록이 비어있지 않은지 확인하고, 비어있다면 기본값으로 처리
    const newClassNm =
      classesInNewGrade.length > 0 ? classesInNewGrade[0].CLASS_NM : "기본값";

    setSelection({ ...selection, GRADE: newGrade, CLASS_NM: newClassNm });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelection({ ...selection, CLASS_NM: e.target.value });
  };

  const filteredTimetable = selectedDate ? timetableByDate[selectedDate] : [];

  return (
    <WrapDetailedContainer>
      <div className="detailed-timetable-title">
        <Image src="/timetable.svg" alt="timetable" width={24} height={24} />
        <h1>시간표 조회</h1>
      </div>
      <InfoSentence>
        월요일부터 금요일까지의 일주일간의 시간표에요. <br /> 세부 시간표는
        학급의 사정에 따라 변경될 수 있어요.
      </InfoSentence>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <WrapTimeTableMainContainer>
          <SelectGradeClassNMContainer>
            <SelectGradeTitle>
              <Image src="/cog.svg" width={24} height={24} alt="시간표" />
              <h2>학년/반 설정</h2>
            </SelectGradeTitle>
            <div className="select-grade">
              <SelectOption
                value={selection.GRADE}
                onChange={handleGradeChange}
              >
                {availableClasses
                  .map((cls) => cls.GRADE)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
              </SelectOption>
              <label htmlFor="grade-select">학년</label>
              <SelectOption
                value={selection.CLASS_NM}
                onChange={handleClassChange}
              >
                {availableClasses
                  .filter((cls) => cls.GRADE === selection.GRADE)
                  .map((cls, index) => (
                    <option key={index} value={cls.CLASS_NM}>
                      {cls.CLASS_NM}
                    </option>
                  ))}
              </SelectOption>
              <label htmlFor="class-select">반</label>
            </div>
            <DateButtonContainer>
              {weekDays.map((day, index) => (
                <DateButton
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  isActive={day === selectedDate}
                >
                  {formatToDay(day)}
                </DateButton>
              ))}
            </DateButtonContainer>
          </SelectGradeClassNMContainer>
          <WeekGrid>
            {selectedDate && (
              <DayContainer>
                <DayHeader>{formatDate(selectedDate)}</DayHeader>
                <table>
                  <tbody>
                    {filteredTimetable.map((item, index) => (
                      <tr key={index}>
                        <PeriodContainer>{item.PERIO}</PeriodContainer>
                        <ClassContainer>{item.ITRT_CNTNT}</ClassContainer>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DayContainer>
            )}
          </WeekGrid>
        </WrapTimeTableMainContainer>
      )}
    </WrapDetailedContainer>
  );
};
