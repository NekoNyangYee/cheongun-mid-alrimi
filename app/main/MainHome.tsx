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
  return (
    <>
      <MainContent>
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