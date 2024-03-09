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
`;

const MealInfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(550px, 1fr));
    gap: 1rem;
    padding: 0;
    margin: 20px 0;
    grid-auto-rows: minmax(200px, auto);

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 868px) {
        grid-template-columns: repeat(1, 1fr);
    }

    @media (max-width: 767px) {
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
    const todayYMD = `${today.getFullYear()}년 ${(today.getMonth() + 1).toString().padStart(2, '0')}월 ${today.getDate().toString().padStart(2, '0')}일`;
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
            <AllMealInfoTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11.9365 13.1038L4.86344 20.1269C4.72497 20.2653 4.55349 20.3387 4.34901 20.3471C4.14454 20.3554 3.96474 20.282 3.80961 20.1269C3.66474 19.982 3.59231 19.8064 3.59231 19.6C3.59231 19.3936 3.66474 19.2179 3.80961 19.0731L13.475 9.40767C13.1558 8.65639 13.0981 7.86632 13.3019 7.03747C13.5058 6.20864 13.9583 5.45384 14.6596 4.77307C15.4275 4.00512 16.3275 3.5205 17.3596 3.31922C18.3916 3.11794 19.2429 3.35255 19.9134 4.02307C20.584 4.69357 20.8186 5.54485 20.6173 6.5769C20.416 7.60895 19.9314 8.50894 19.1634 9.27687C18.4827 9.97815 17.7279 10.4307 16.899 10.6346C16.0702 10.8384 15.2801 10.7807 14.5288 10.4615L12.9903 12L20.0634 19.0731C20.2019 19.2115 20.2753 19.383 20.2836 19.5875C20.2919 19.792 20.2186 19.9718 20.0634 20.1269C19.9186 20.2718 19.7429 20.3426 19.5365 20.3394C19.3301 20.3362 19.1545 20.2653 19.0096 20.1269L11.9365 13.1038ZM7.34421 12.1615L4.45961 9.27687C3.83654 8.6538 3.42693 7.85702 3.23076 6.88652C3.03461 5.916 3.18846 5.04614 3.69231 4.27692C3.84999 4.03334 4.07179 3.89488 4.35769 3.86155C4.64357 3.82821 4.88844 3.9186 5.09229 4.1327L10.2173 9.28845L7.34421 12.1615Z" fill="black" />
                </svg>
                <h2>{mealsIsMonth}월 급식 정보</h2>
            </AllMealInfoTitle>
            <CurrentYMD>{todayYMD}</CurrentYMD>
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
