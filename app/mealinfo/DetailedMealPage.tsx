"use client"

import React, { useEffect } from 'react';
import { useMealInfoStore } from '@/app/Store/mealInfoStore';
import styled from '@emotion/styled';

const PageContainer = styled.div`
  text-align: center;
  align-items: center; // 중앙 정렬을 위해 추가
  width: 100%; // 컨테이너가 전체 너비를 차지하도록 설정
`;

const StyledMealInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid #E4E4E7;
    border-radius: 12px;
    background-color: #FFFFFF;
    box-sizing: border-box;
    flex-direction: column;
    line-height: 1.5;
    gap: 16px;
    justify-content: space-between;
    overflow: hidden; // 내용이 넘칠 경우 숨김 처리
    height: 300px; // 고정 높이 설정

    & h3 {
        margin: 0;
        font-size: 1rem;
    }

    & ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    & p {
        color: #18181B;
        margin: 0;
        color: #71717A;
        font-size: 0.9rem;
        font-weight: normal;
        white-space: pre-line;
        overflow: auto; // 내용이 넘칠 경우 스크롤 표시
    }

    & li {
        margin: 0;
        padding: 0;
        font-size: 1rem;
        color: #18181B;
        font-weight: bold;
    }
`;

const MealInfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(550px, 1fr)); // 최소 250px, 사용 가능한 공간에 맞춰 자동으로 1fr로 조정
    gap: 1rem; // 그리드 아이템 사이의 간격
    padding: 0;
    grid-auto-rows: minmax(200px, auto);

    @media (min-width: 1024px) { // PC 해상도
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 868px) { // 태블릿 해상도
        grid-template-columns: repeat(1, 1fr);
    }

    @media (max-width: 767px) { // 모바일 해상도
        grid-template-columns: repeat(1, 1fr);
    }
`;

const DetailedMealPage = () => {
    const { allMealInfos, setAllMealInfos, setIsLoading } = useMealInfoStore();

    useEffect(() => {
        // allMealInfos가 비어 있을 때만 API 호출
        if (allMealInfos.length === 0) {
            setIsLoading(true);
            const fetchMealData = async () => {
                try {
                    const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
                    const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
                    const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
                    const today = new Date();
                    const response = await fetch(
                        `/api/education?endpoint=mealServiceDietInfo&KEY=${API_KEY}&Type=json&pIndex=1&pSize=365&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${today.getFullYear()}`
                    );
                    if (!response.ok) {
                        throw new Error('데이터를 불러오는 중에 오류가 발생했습니다.');
                    }
                    const data = await response.json();
                    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1].row) {
                        setAllMealInfos(data.mealServiceDietInfo[1].row);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchMealData();
        }
    }, [allMealInfos, setAllMealInfos, setIsLoading]);

    const today = new Date();
    const currentYearMonth = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const mealsIsMonth = today.getMonth() + 1;

    const mealsForMonth = Array.from({ length: daysInMonth }).map((_, index) => {
        const day = (index + 1).toString().padStart(2, '0');
        const fullDate = `${currentYearMonth}${day}`;
        const mealForDay = allMealInfos.find(meal => meal.MLSV_YMD === fullDate);
        return mealForDay || {
            MLSV_YMD: fullDate,
            DDISH_NM: "이 날은 급식이 없어요",
            CAL_INFO: "0 Kcal",
        };
    });

    return (
        <PageContainer>
            <h2>{mealsIsMonth}월 전체 급식 정보</h2>
            <MealInfoGrid>
                {mealsForMonth.length > 0 ? (
                    mealsForMonth.map((meal, index) => (
                        <StyledMealInfo key={index}>
                            <h3>{`${meal.MLSV_YMD.slice(4, 6)}월 ${meal.MLSV_YMD.slice(6, 8)}일`} 점심</h3>
                            <p>{meal.DDISH_NM.replace(/<br\/>/g, '\n')}</p>
                            <p>{meal.CAL_INFO}</p>
                        </StyledMealInfo>
                    ))
                ) : (
                    <p>이번 달 급식 정보가 없습니다.</p>
                )}
            </MealInfoGrid>
        </PageContainer>
    );

};

export default DetailedMealPage;
