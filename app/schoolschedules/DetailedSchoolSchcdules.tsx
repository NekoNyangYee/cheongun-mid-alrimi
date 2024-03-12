"use client";

import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useScheduleStore } from "@/app/Store/scheduleStore";

const DetailedScheduleContainer = styled.div`
  text-align: center;
  align-items: center;
  width: 100%;
`;

const WrapSchoolScheduleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: start; // 각 월별 컨테이너의 시작점을 상단에 맞춥니다.
  text-align: center;
  width: 100%;
  margin: 20px 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

@media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
}
`;

const MonthContainer = styled.div`
  border: 1px solid #E4E4E7;
  border-radius: 12px;
  overflow: hidden; // 내부 오버플로우를 숨깁니다.
`;

// 월별 제목 스타일
const MonthTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  padding: 10px;
  background-color: transparent;

  & svg {
    width: 20px;
    height: 20px;
  }
`;

const EventList = styled.ul`
  display: grid;
  list-style: none;
  margin: 0;
  padding: 1rem;
  height: 300px;
  overflow-y: auto;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 4px;   
}

&::-webkit-scrollbar-thumb {
    border-radius: 12px;
    background-color: #F2F2F2;
}

&::-webkit-scrollbar-track {
    border-radius: 3px;
    background-color: tarnsparent;
}
`;

const EventItem = styled.li`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  & h4, & p {
    margin: 0;
    padding: 2px 0;
  }

  & h4 {
    font-size: 1.1rem;
    color: #333;
  }

  & p {
    font-size: 0.9rem;
    color: #71717A;
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
  color: #71717A;
  margin: 6px 0;
  text-align: left;
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
  const { monthEvents, setMonthEvents, sortedEvents, setSortedEvents, isLoading, setIsLoading } = useScheduleStore();

  const date: Date = new Date();
  const CurrentYear: number = date.getFullYear();

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

          if (!response.ok) throw new Error('데이터를 불러오는 중에 오류가 발생했습니다.');

          const data = await response.json();

          // API 응답 구조에 따라 접근해야 할 수 있음
          const events = data.SchoolSchedule?.[1]?.row ?? [];

          if (events.length === 0) break; // 데이터가 없으면 반복 종료

          allEvents = allEvents.concat(events);
          pageIndex++;
        }

        // 여기에서 2024년 데이터 필터링 및 상태 업데이트
        const filteredEvents: Array<EventData> = allEvents.filter(event => event.AA_YMD.startsWith(CurrentYear.toString()) && parseInt(event.AA_YMD.substring(0, 4)) === CurrentYear)
          .map(event => ({
            EVENT_NM: event.EVENT_NM,
            AA_YMD: event.AA_YMD,
            DISPLAY_DATE: `${parseInt(event.AA_YMD.substring(4, 6), 10)}월 ${parseInt(event.AA_YMD.substring(6), 10)}일`,
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
      const sorted: MonthEvents = monthEvents.reduce((acc: MonthEvents, event: EventData) => {
        const month: string = event.AA_YMD.substring(4, 6);
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(event);
        return acc;
      }, {});

      setSortedEvents(sorted);
    };

    sortEventsByMonth();
  }, [monthEvents]);

  const sortedMonths: Array<string> = Object.keys(sortedEvents).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <DetailedScheduleContainer>
      <AllScheduleInfoTitle>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 11.5C3.71667 11.5 3.47933 11.404 3.288 11.212C3.096 11.0207 3 10.7833 3 10.5V6C3 5.71667 3.096 5.479 3.288 5.287C3.47933 5.09567 3.71667 5 4 5H7.325C7.60833 5 7.846 5.09567 8.038 5.287C8.22933 5.479 8.325 5.71667 8.325 6V10.5C8.325 10.7833 8.22933 11.0207 8.038 11.212C7.846 11.404 7.60833 11.5 7.325 11.5H4ZM10.325 11.5C10.0417 11.5 9.80433 11.404 9.613 11.212C9.421 11.0207 9.325 10.7833 9.325 10.5V6C9.325 5.71667 9.421 5.479 9.613 5.287C9.80433 5.09567 10.0417 5 10.325 5H13.675C13.9583 5 14.196 5.09567 14.388 5.287C14.5793 5.479 14.675 5.71667 14.675 6V10.5C14.675 10.7833 14.5793 11.0207 14.388 11.212C14.196 11.404 13.9583 11.5 13.675 11.5H10.325ZM16.675 11.5C16.3917 11.5 16.1543 11.404 15.963 11.212C15.771 11.0207 15.675 10.7833 15.675 10.5V6C15.675 5.71667 15.771 5.479 15.963 5.287C16.1543 5.09567 16.3917 5 16.675 5H20C20.2833 5 20.5207 5.09567 20.712 5.287C20.904 5.479 21 5.71667 21 6V10.5C21 10.7833 20.904 11.0207 20.712 11.212C20.5207 11.404 20.2833 11.5 20 11.5H16.675ZM4 19C3.71667 19 3.47933 18.904 3.288 18.712C3.096 18.5207 3 18.2833 3 18V13.5C3 13.2167 3.096 12.979 3.288 12.787C3.47933 12.5957 3.71667 12.5 4 12.5H7.325C7.60833 12.5 7.846 12.5957 8.038 12.787C8.22933 12.979 8.325 13.2167 8.325 13.5V18C8.325 18.2833 8.22933 18.5207 8.038 18.712C7.846 18.904 7.60833 19 7.325 19H4ZM10.325 19C10.0417 19 9.80433 18.904 9.613 18.712C9.421 18.5207 9.325 18.2833 9.325 18V13.5C9.325 13.2167 9.421 12.979 9.613 12.787C9.80433 12.5957 10.0417 12.5 10.325 12.5H13.675C13.9583 12.5 14.196 12.5957 14.388 12.787C14.5793 12.979 14.675 13.2167 14.675 13.5V18C14.675 18.2833 14.5793 18.5207 14.388 18.712C14.196 18.904 13.9583 19 13.675 19H10.325ZM16.675 19C16.3917 19 16.1543 18.904 15.963 18.712C15.771 18.5207 15.675 18.2833 15.675 18V13.5C15.675 13.2167 15.771 12.979 15.963 12.787C16.1543 12.5957 16.3917 12.5 16.675 12.5H20C20.2833 12.5 20.5207 12.5957 20.712 12.787C20.904 12.979 21 13.2167 21 13.5V18C21 18.2833 20.904 18.5207 20.712 18.712C20.5207 18.904 20.2833 19 20 19H16.675Z" fill="black" />
        </svg>
        <h2>{CurrentYear}년 학사일정</h2>
      </AllScheduleInfoTitle>
      <InfoSentence>{CurrentYear}년도의 학사일정이에요.<br />해당 일정은 추후 변동되거나 삭제/추가될 수 있어요.</InfoSentence>
      <WrapSchoolScheduleContainer>
        {sortedMonths.length > 0 ? sortedMonths.map((month) => (
          <MonthContainer key={month}>
            <MonthTitle><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.98077 16.1249C3.60193 16.1249 3.28125 15.9937 3.01875 15.7312C2.75625 15.4687 2.625 15.148 2.625 14.7692V4.73076C2.625 4.35191 2.75625 4.03123 3.01875 3.76873C3.28125 3.50623 3.60193 3.37498 3.98077 3.37498H5.01924V2.36535C5.01924 2.20094 5.07429 2.06368 5.18439 1.95358C5.29448 1.8435 5.43174 1.78845 5.59616 1.78845C5.76058 1.78845 5.89783 1.8435 6.00793 1.95358C6.11802 2.06368 6.17306 2.20094 6.17306 2.36535V3.37498H11.8557V2.35093C11.8557 2.19132 11.9096 2.05767 12.0173 1.94998C12.125 1.8423 12.2586 1.78845 12.4182 1.78845C12.5778 1.78845 12.7115 1.8423 12.8192 1.94998C12.9269 2.05767 12.9807 2.19132 12.9807 2.35093V3.37498H14.0192C14.398 3.37498 14.7187 3.50623 14.9812 3.76873C15.2437 4.03123 15.375 4.35191 15.375 4.73076V14.7692C15.375 15.148 15.2437 15.4687 14.9812 15.7312C14.7187 15.9937 14.398 16.1249 14.0192 16.1249H3.98077ZM3.98077 15H14.0192C14.0769 15 14.1298 14.9759 14.1779 14.9279C14.2259 14.8798 14.25 14.8269 14.25 14.7692V7.73076H3.74998V14.7692C3.74998 14.8269 3.77402 14.8798 3.82209 14.9279C3.87018 14.9759 3.92308 15 3.98077 15ZM8.99998 10.5577C8.81633 10.5577 8.65984 10.493 8.53052 10.3637C8.40119 10.2343 8.33653 10.0779 8.33653 9.89421C8.33653 9.71056 8.40119 9.55407 8.53052 9.42475C8.65984 9.29542 8.81633 9.23076 8.99998 9.23076C9.18363 9.23076 9.34012 9.29542 9.46944 9.42475C9.59877 9.55407 9.66343 9.71056 9.66343 9.89421C9.66343 10.0779 9.59877 10.2343 9.46944 10.3637C9.34012 10.493 9.18363 10.5577 8.99998 10.5577ZM5.99998 10.5577C5.81633 10.5577 5.65984 10.493 5.53052 10.3637C5.40119 10.2343 5.33653 10.0779 5.33653 9.89421C5.33653 9.71056 5.40119 9.55407 5.53052 9.42475C5.65984 9.29542 5.81633 9.23076 5.99998 9.23076C6.18363 9.23076 6.34012 9.29542 6.46944 9.42475C6.59877 9.55407 6.66343 9.71056 6.66343 9.89421C6.66343 10.0779 6.59877 10.2343 6.46944 10.3637C6.34012 10.493 6.18363 10.5577 5.99998 10.5577ZM12 10.5577C11.8163 10.5577 11.6598 10.493 11.5305 10.3637C11.4012 10.2343 11.3365 10.0779 11.3365 9.89421C11.3365 9.71056 11.4012 9.55407 11.5305 9.42475C11.6598 9.29542 11.8163 9.23076 12 9.23076C12.1836 9.23076 12.3401 9.29542 12.4694 9.42475C12.5988 9.55407 12.6634 9.71056 12.6634 9.89421C12.6634 10.0779 12.5988 10.2343 12.4694 10.3637C12.3401 10.493 12.1836 10.5577 12 10.5577ZM8.99998 13.5C8.81633 13.5 8.65984 13.4353 8.53052 13.306C8.40119 13.1767 8.33653 13.0202 8.33653 12.8365C8.33653 12.6529 8.40119 12.4964 8.53052 12.3671C8.65984 12.2377 8.81633 12.173 8.99998 12.173C9.18363 12.173 9.34012 12.2377 9.46944 12.3671C9.59877 12.4964 9.66343 12.6529 9.66343 12.8365C9.66343 13.0202 9.59877 13.1767 9.46944 13.306C9.34012 13.4353 9.18363 13.5 8.99998 13.5ZM5.99998 13.5C5.81633 13.5 5.65984 13.4353 5.53052 13.306C5.40119 13.1767 5.33653 13.0202 5.33653 12.8365C5.33653 12.6529 5.40119 12.4964 5.53052 12.3671C5.65984 12.2377 5.81633 12.173 5.99998 12.173C6.18363 12.173 6.34012 12.2377 6.46944 12.3671C6.59877 12.4964 6.66343 12.6529 6.66343 12.8365C6.66343 13.0202 6.59877 13.1767 6.46944 13.306C6.34012 13.4353 6.18363 13.5 5.99998 13.5ZM12 13.5C11.8163 13.5 11.6598 13.4353 11.5305 13.306C11.4012 13.1767 11.3365 13.0202 11.3365 12.8365C11.3365 12.6529 11.4012 12.4964 11.5305 12.3671C11.6598 12.2377 11.8163 12.173 12 12.173C12.1836 12.173 12.3401 12.2377 12.4694 12.3671C12.5988 12.4964 12.6634 12.6529 12.6634 12.8365C12.6634 13.0202 12.5988 13.1767 12.4694 13.306C12.3401 13.4353 12.1836 13.5 12 13.5Z" fill="#18181B" />
            </svg>
              {`${parseInt(month, 10)}월`}
            </MonthTitle>
            {isLoading ? (
              <p>로딩 중...</p> // 로딩 상태일 때 표시될 내용
            ) : (
              <EventList>
                {sortedEvents[month].map((event, index) => (
                  <EventItem key={index}>
                    <h4>{event.DISPLAY_DATE}</h4>
                    <p>{event.EVENT_NM}</p>
                  </EventItem>
                ))}
              </EventList>
            )}
          </MonthContainer>
        )) : (
          <p>현재 학사 일정이 없습니다.</p>
        )}
      </WrapSchoolScheduleContainer>
    </DetailedScheduleContainer>
  );
};

export default EducationSchedules;