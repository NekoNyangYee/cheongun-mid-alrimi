"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useScheduleStore } from "@/app/Store/scheduleStore";

const WrapContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const DetailedScheduleContainer = styled.div`
  text-align: center;
  align-items: center;
  width: 100%;
`;

const WrapSchoolScheduleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-items: start; // 각 월별 컨테이너의 시작점을 상단에 맞춥니다.
  text-align: left;
  width: 100%;

  & h4,
  p {
    margin: 0;
  }

  & p {
    color: #71717a;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const EventItem = styled.div`
  display: flex;
  padding: 8px 1rem;
  justify-content: space-between;
  gap: 8px;
  border-left: 2px solid #e4e4e7;

  & .event-date-info {
    display: flex;
    flex-direction: column;
  }

  & svg {
    width: 24px;
    height: 24px;
    margin: auto 0;
  }
`;

const AllScheduleInfoTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: start;

  & svg {
    width: 24px;
    height: 24px;
  }

  & h2 {
    font-size: 1.5rem;
    margin: 0;
  }
`;

const InfoSentence = styled.p`
  font-size: 0.9rem;
  color: #71717a;
  margin: 6px 0;
  text-align: left;
`;

const PaginationButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  height: auto;
  background-color: ${(props) => (props.isActive ? "#000000" : "#EFEFEF")};
  color: ${(props) => (props.isActive ? "#FFFFFF" : "#000000")};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const PaginationContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  height: 160px;
  justify-content: center;
  justify-content: flex-start;
  gap: 8px;
`;

interface EventData {
  EVENT_NM: string;
  AA_YMD: string;
  DISPLAY_DATE: string;
}

interface MonthEvents {
  [key: string]: Array<EventData>;
}

const EducationSchedules = () => {
  const { monthEvents, setMonthEvents, isLoading, setIsLoading } =
    useScheduleStore();
  const date: Date = new Date();
  const CurrentYear: number = date.getFullYear();
  const CurrentMonth = date.getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState(
    CurrentMonth.toString().padStart(2, "0")
  );

  const uniqueMonths = Array.from(
    new Set(monthEvents.map((event) => event.AA_YMD.substring(4, 6)))
  ).sort();

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  const filteredEventsBySelectedMonth = monthEvents.filter(
    (event) => event.AA_YMD.substring(4, 6) === selectedMonth
  );

  useEffect(() => {
    setIsLoading(true);
    const fetchEvents = async (): Promise<void> => {
      const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE!;
      const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE!;
      const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY!;
      let allEvents: Array<EventData> = [];
      let pageIndex: number = 1;
      const pageSize: number = 1000; // API 문서에 따라 설정

      try {
        while (true) {
          const response: Response = await fetch(
            `/api/education?endpoint=SchoolSchedule&KEY=${API_KEY}&pIndex=${pageIndex}&pSize=${pageSize}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AA_YMD=${CurrentYear}`
          );

          if (!response.ok)
            throw new Error("데이터를 불러오는 중에 오류가 발생했습니다.");

          const data = await response.json();

          // API 응답 구조에 따라 접근해야 할 수 있음
          const events = data.SchoolSchedule?.[1]?.row ?? [];

          if (events.length === 0) break; // 데이터가 없으면 반복 종료

          allEvents = allEvents.concat(events);
          pageIndex++;
        }

        // 여기에서 2024년 데이터 필터링 및 상태 업데이트
        const filteredEvents: Array<EventData> = allEvents
          .filter(
            (event) =>
              event.AA_YMD.startsWith(CurrentYear.toString()) &&
              parseInt(event.AA_YMD.substring(0, 4)) === CurrentYear
          )
          .map((event) => ({
            EVENT_NM: event.EVENT_NM,
            AA_YMD: event.AA_YMD,
            DISPLAY_DATE: `${parseInt(
              event.AA_YMD.substring(4, 6),
              10
            )}월 ${parseInt(event.AA_YMD.substring(6), 10)}일`,
          }));

        setMonthEvents(filteredEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents().then(() => {
      setIsLoading(false); // 데이터 로딩 완료
    });
  }, [setMonthEvents, setIsLoading]);

  useEffect(() => {
    // 월별로 데이터 분류
    const sortEventsByMonth = () => {
      const sorted: MonthEvents = monthEvents.reduce(
        (acc: MonthEvents, event: EventData) => {
          const month: string = event.AA_YMD.substring(4, 6);
          if (!acc[month]) {
            acc[month] = [];
          }
          acc[month].push(event);
          return acc;
        },
        {}
      );
    };

    sortEventsByMonth();
  }, [monthEvents]);

  return (
    <DetailedScheduleContainer>
      <AllScheduleInfoTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 11.5C3.71667 11.5 3.47933 11.404 3.288 11.212C3.096 11.0207 3 10.7833 3 10.5V6C3 5.71667 3.096 5.479 3.288 5.287C3.47933 5.09567 3.71667 5 4 5H7.325C7.60833 5 7.846 5.09567 8.038 5.287C8.22933 5.479 8.325 5.71667 8.325 6V10.5C8.325 10.7833 8.22933 11.0207 8.038 11.212C7.846 11.404 7.60833 11.5 7.325 11.5H4ZM10.325 11.5C10.0417 11.5 9.80433 11.404 9.613 11.212C9.421 11.0207 9.325 10.7833 9.325 10.5V6C9.325 5.71667 9.421 5.479 9.613 5.287C9.80433 5.09567 10.0417 5 10.325 5H13.675C13.9583 5 14.196 5.09567 14.388 5.287C14.5793 5.479 14.675 5.71667 14.675 6V10.5C14.675 10.7833 14.5793 11.0207 14.388 11.212C14.196 11.404 13.9583 11.5 13.675 11.5H10.325ZM16.675 11.5C16.3917 11.5 16.1543 11.404 15.963 11.212C15.771 11.0207 15.675 10.7833 15.675 10.5V6C15.675 5.71667 15.771 5.479 15.963 5.287C16.1543 5.09567 16.3917 5 16.675 5H20C20.2833 5 20.5207 5.09567 20.712 5.287C20.904 5.479 21 5.71667 21 6V10.5C21 10.7833 20.904 11.0207 20.712 11.212C20.5207 11.404 20.2833 11.5 20 11.5H16.675ZM4 19C3.71667 19 3.47933 18.904 3.288 18.712C3.096 18.5207 3 18.2833 3 18V13.5C3 13.2167 3.096 12.979 3.288 12.787C3.47933 12.5957 3.71667 12.5 4 12.5H7.325C7.60833 12.5 7.846 12.5957 8.038 12.787C8.22933 12.979 8.325 13.2167 8.325 13.5V18C8.325 18.2833 8.22933 18.5207 8.038 18.712C7.846 18.904 7.60833 19 7.325 19H4ZM10.325 19C10.0417 19 9.80433 18.904 9.613 18.712C9.421 18.5207 9.325 18.2833 9.325 18V13.5C9.325 13.2167 9.421 12.979 9.613 12.787C9.80433 12.5957 10.0417 12.5 10.325 12.5H13.675C13.9583 12.5 14.196 12.5957 14.388 12.787C14.5793 12.979 14.675 13.2167 14.675 13.5V18C14.675 18.2833 14.5793 18.5207 14.388 18.712C14.196 18.904 13.9583 19 13.675 19H10.325ZM16.675 19C16.3917 19 16.1543 18.904 15.963 18.712C15.771 18.5207 15.675 18.2833 15.675 18V13.5C15.675 13.2167 15.771 12.979 15.963 12.787C16.1543 12.5957 16.3917 12.5 16.675 12.5H20C20.2833 12.5 20.5207 12.5957 20.712 12.787C20.904 12.979 21 13.2167 21 13.5V18C21 18.2833 20.904 18.5207 20.712 18.712C20.5207 18.904 20.2833 19 20 19H16.675Z"
            fill="black"
          />
        </svg>
        <h2>{CurrentYear}년 학사일정</h2>
      </AllScheduleInfoTitle>
      <InfoSentence>
        {CurrentYear}년도의 학사일정이에요.
        <br />
        해당 일정은 추후 변동되거나 삭제될 수 있어요.
      </InfoSentence>
      <WrapContainer>
        <PaginationContainer>
          {uniqueMonths.map((month) => (
            <PaginationButton
              key={month}
              onClick={() => handleMonthClick(month)}
              className={month === selectedMonth ? "active" : ""}
              isActive={month === selectedMonth}
            >
              {parseInt(month, 10)}월
            </PaginationButton>
          ))}
        </PaginationContainer>
        <WrapSchoolScheduleContainer>
          {filteredEventsBySelectedMonth.length > 0 &&
            filteredEventsBySelectedMonth.map((event, index) => (
              <EventItem key={index}>
                <div className="event-date-info">
                  <h4>{event.DISPLAY_DATE}</h4>
                  <p>{event.EVENT_NM}</p>
                </div>
                {event.EVENT_NM.includes("개교기념일") ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 10H17V8L12.5 6.2V4H15V2H11.5V6.2L7 8V10H3C2.45 10 2 10.45 2 11V22H10V17H14V22H22V11C22 10.45 21.55 10 21 10ZM8 20H4V17H8V20ZM8 15H4V12H8V15ZM12 8C12.55 8 13 8.45 13 9C13 9.55 12.55 10 12 10C11.45 10 11 9.55 11 9C11 8.45 11.45 8 12 8ZM14 15H10V12H14V15ZM20 20H16V17H20V20ZM20 15H16V12H20V15Z"
                      fill="#FF8A00"
                    />
                  </svg>
                ) : event.EVENT_NM.includes("학기") &&
                  event.EVENT_NM.includes("고사") ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M19.7832 1.24341L18.5232 3.99341L15.7832 5.24341L18.5232 6.50341L19.7832 9.24341L21.0332 6.50341L23.7832 5.24341L21.0332 3.99341M9.7832 4.24341L7.2832 9.74341L1.7832 12.2434L7.2832 14.7434L9.7832 20.2434L12.2832 14.7434L17.7832 12.2434L12.2832 9.74341M19.7832 15.2434L18.5232 17.9834L15.7832 19.2434L18.5232 20.4934L19.7832 23.2434L21.0332 20.4934L23.7832 19.2434L21.0332 17.9834"
                      fill="#F0D234"
                    />
                  </svg>
                ) : event.EVENT_NM.includes("선거") ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M18.2937 13.7133H17.6137L15.6137 15.7133H17.5237L19.2937 17.7133H5.2937L7.0737 15.7133H9.1237L7.1237 13.7133H6.2937L3.2937 16.7133V20.7133C3.2937 21.2437 3.50441 21.7524 3.87949 22.1275C4.25456 22.5026 4.76327 22.7133 5.2937 22.7133H19.2937C19.8241 22.7133 20.3328 22.5026 20.7079 22.1275C21.083 21.7524 21.2937 21.2437 21.2937 20.7133V16.7133L18.2937 13.7133ZM17.2937 8.6633L12.3437 13.6133L8.7937 10.0733L13.7537 5.1233L17.2937 8.6633ZM13.0537 3.0033L6.6837 9.3733C6.2937 9.7633 6.2937 10.3933 6.6837 10.7833L11.6337 15.7133C12.0237 16.1233 12.6537 16.1233 13.0437 15.7133L19.4037 9.3733C19.7937 8.9833 19.7937 8.3533 19.4037 7.9633L14.4537 3.0133C14.0737 2.6133 13.4437 2.6133 13.0537 3.0033Z"
                      fill="#FF5555"
                    />
                  </svg>
                ) : null}
              </EventItem>
            ))}
        </WrapSchoolScheduleContainer>
      </WrapContainer>
    </DetailedScheduleContainer>
  );
};

export default EducationSchedules;
