"use client";

import React from "react";
import styled from "@emotion/styled";

import EducationMealServiceDietInfo from "@/Components/EducationMealServiceDietInfo";
import EducationSchedules from "@/Components/EducationSchedules";
import EducationTimeTable from "@/Components/EducationTimeTable";
import { ShortcutTab } from "@/Components/ShortcutTab";
import Image from "next/image";

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
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  & .wrap-shortcut-title-container {
    position: relative; // 상대 위치 설정
    display: flex;
    flex-direction: column;
    gap: 8px;

    & h1, & p {
      position: absolute; // 절대 위치 설정
      color: #E4E4E7;
    }

    & h1 {
      font-size: 2rem;
      margin: 0;
      top: 190px; // 이미지 위의 위치 조정
      left: 20px;

      @media (max-width: 768px) {
        font-size: 1.8rem;
      }
    }

    & p {
      font-size: 0.94rem;
      color: #E4E4E7;
      margin: 0;
      top: 170px;
      left: 20px;
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

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 250px;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80%; // 그라디언트 높이 조정
    background: linear-gradient(to top, black, transparent);
    z-index: 1;
    border-radius: 12px;
  }

  & img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  & h1, & p {
    z-index: 2; // 텍스트 위에 그라디언트를 배치
  }
`;


export const MainHome = () => {
  const todaydate: Date = new Date();
  const today: string = `${todaydate.getFullYear()}년 ${todaydate.getMonth() + 1}월 ${todaydate.getDate()}일`;
  return (
    <>
      <MainContent>
        <div className="wrap-shortcut-title-container">
          <ImageWrapper>
            <Image src="/logo/banner.webp" alt="청운중학교 로고" layout="fill" objectFit="cover" />
            <h1>청운중학교 (청주)</h1>
            <p>{today}</p>
          </ImageWrapper>
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