"use client";

import React from "react";
import styled from "@emotion/styled";

import EducationMealServiceDietInfo from "@/Components/EducationMealServiceDietInfo";
import EducationSchedules from "@/Components/EducationSchedules";
import EducationTimeTable from "@/Components/EducationTimeTable";
import { ShortcutTab } from "@/Components/ShortcutTab";

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%; // 모바일 뷰에서는 너비를 100%로 설정
  gap: 24px;

  @media (max-width: 1224px) {
    width: 100%;
  }
`;

const MainContent = styled.div`
  width: 70%; // 모바일 뷰에서는 너비를 100%로 설정
  display: flex;
  flex-direction: column;
  gap: 24px;

  & .wrap-shortcut-title-container {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & h1 {
      font-size: 2rem;
      margin: 0;

      @media (max-width: 768px) {
        font-size: 1.8rem;
      }
    }

    & p {
      font-size: 0.94rem;
      color: #71717A;
      margin: 0;
    }
  }

  

  & hr {
    width: 100%;
    border: 1px solid #E4E4E7;
    margin: 0;
  }

  @media (max-width: 1224px) {
    width: 100%;
}
`;

export const MainHome = () => {
  const todaydate: Date = new Date();
  const today: string = `${todaydate.getFullYear()}년 ${todaydate.getMonth() + 1}월 ${todaydate.getDate()}일`;
  return (
    <>
      <MainContent>
        <div className="wrap-shortcut-title-container">
          <h1>청운중학교 (청주)</h1>
          <p>{today}</p>
        </div>
        <ShortcutTab />
        <hr />
        <EducationMealServiceDietInfo />
      </MainContent>
      <Sidebar>
        <EducationSchedules />
        <EducationTimeTable />
      </Sidebar>
    </>
  );
}