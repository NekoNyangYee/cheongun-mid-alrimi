"use client"

import React, { useEffect } from 'react';
import { useMealInfoStore } from '@/app/Store/mealInfoStore';
import styled from '@emotion/styled';
import { MealInfo } from '@/Components/EducationMealServiceDietInfo';
import { API_KEY, OFFICE_CODE, SCHOOL_CODE } from '../utils/constants';
import Image from 'next/image';

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
    }
`;

const MealInfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 0;
    margin: 20px 0;
    grid-auto-rows: minmax(200px, auto);

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 768px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;

const AllMealInfoTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;

    & h2 {
        font-size: 1.5rem;
        margin: 0;
    }
`;

const CurrentYMD = styled.p`
    font-size: 0.9rem;
    margin: 0;
    color: #71717A;
    text-align: left;
`;

const InfoSentence = styled.p`
  font-size: 0.9rem;
  color: #71717A;
  margin: 6px 0;
  text-align: left;
`;

const DetailedMealPage = () => {
    const { allMealInfos, setAllMealInfos, setIsLoading } = useMealInfoStore();

    useEffect(() => {
        // allMealInfos가 비어 있을 때만 API 호출
        if (allMealInfos.length === 0) {
            setIsLoading(true);
            const fetchMealData = async (): Promise<void> => {
                try {
                    const today: Date = new Date();
                    const response: Response = await fetch(
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

    const today: Date = new Date();
    const todayYMD: string = `${today.getFullYear()}년 ${(today.getMonth() + 1).toString().padStart(2, '0')}월 ${today.getDate().toString().padStart(2, '0')}일`;
    const currentYearMonth: string = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const daysInMonth: number = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const mealsIsMonth: number = today.getMonth() + 1;

    const mealsForMonth: Array<MealInfo> = Array.from({ length: daysInMonth }).map((_, index) => {
        const day: string = (index + 1).toString().padStart(2, '0');
        const fullDate: string = `${currentYearMonth}${day}`;
        const mealForDay = allMealInfos.find(meal => meal.MLSV_YMD === fullDate);
        return mealForDay || {
            MLSV_YMD: fullDate,
            DDISH_NM: "이 날은 급식이 없어요",
            CAL_INFO: "0 Kcal",
        };
    });

    return (
        <PageContainer>
            <AllMealInfoTitle>
                <Image src="/restaurant-menu.svg" alt="급식 정보" width={24} height={24} />
                <h2>{mealsIsMonth}월 급식 정보</h2>
            </AllMealInfoTitle>
            <CurrentYMD>{todayYMD}</CurrentYMD>
            <InfoSentence>{mealsIsMonth}월 한달 간의 급식 정보에요.<br />급식 정보는 추후 변동될 수 있어요.</InfoSentence>
            <MealInfoGrid>
                {mealsForMonth.length > 0 ? (
                    mealsForMonth.map((meal, index) => (
                        <StyledMealInfo key={index}>
                            <h3>{new Date(Number(meal.MLSV_YMD.slice(0, 4)), parseInt(meal.MLSV_YMD.slice(4, 6)) - 1, Number(meal.MLSV_YMD.slice(6, 8)))
                                .toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }) + " 점심"}</h3>
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
