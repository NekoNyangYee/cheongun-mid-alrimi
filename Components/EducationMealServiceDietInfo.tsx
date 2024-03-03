"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

const MealTitle = styled.h1(() => `
    font-size: 1.2rem;
`);

const WrapMealInfoContainer = styled.div(() => `
    display: flex;
    gap: 10px;
    border: none;
    border-radius: 10px;
    background-color: #FFFFFF;
    text-align: center;
    overflow-x: scroll;

    & h1 {
        text-align: left;
        font-size: 1.2rem;
    }
`);

const MenuContainer = styled.div(() => `
    padding: 1rem;
    border: 1px solid #E4E4E7;
    border-radius: 12px;
    flex: 0 0 200px; // 이 부분에서 flex-basis를 200px로 설정합니다. 필요에 따라 조정하세요.
    box-sizing: border-box; // 패딩이 너비에 포함되도록 합니다.
    justify-content: space-between; /* 내용이 적을 때도 하단 내용을 아래로 밀어내기 위해 */
    flex: 1 0 auto; /* flex-grow, flex-shrink, flex-basis 설정 */
    min-height: 100px;

    & p {
        margin: 1rem 0;
        color: #71717A;
        font-weight: bold;
        font-size: 0.9rem;
        white-space: pre-wrap;
    }

    & h2 {
        margin: 0;
        font-size: 1rem;
    }
`);

interface MealInfo {
    MLSV_YMD: string;
    DDISH_NM: string;
    CAL_INFO: string;
}

const EducationMealServiceDietInfo: React.FC = () => {
    const [mealInfos, setMealInfos] = useState<MealInfo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMealData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
                const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
                const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
                const response = await fetch(`/api/education?endpoint=mealServiceDietInfo&KEY=${API_KEY}&Type=json&pIndex=1&pSize=365&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${new Date().getFullYear()}`);

                if (!response.ok) {
                    throw new Error('데이터를 불러오는 중에 오류가 발생했습니다.');
                }

                const data = await response.json();
                // Ensure we have the expected data structure
                if (data.mealServiceDietInfo && data.mealServiceDietInfo[1].row) {
                    const meals: MealInfo[] = data.mealServiceDietInfo[1].row;
                    // Filter for meals from today onwards, then take the next 7 days
                    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                    const startIndex = meals.findIndex(meal => meal.MLSV_YMD >= todayStr);
                    const upcomingMeals = meals.slice(startIndex, startIndex + 7);
                    setMealInfos(upcomingMeals);
                }
            } catch (error: any) {
                setError('알 수 없는 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMealData();
    }, []);

    return (
        <>
            <MealTitle>급식 정보</MealTitle>
            <WrapMealInfoContainer>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : mealInfos.length > 0 ? (
                    mealInfos.map(mealInfo => (
                        <MenuContainer key={mealInfo.MLSV_YMD}>
                            <h2>
                                {new Date(Number(mealInfo.MLSV_YMD.slice(0, 4)), parseInt(mealInfo.MLSV_YMD.slice(4, 6)) - 1, Number(mealInfo.MLSV_YMD.slice(6, 8)))
                                    .toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })} 점심
                            </h2>
                            <p>{mealInfo.DDISH_NM.replace(/<br\/>/g, '\n')}</p>
                            <p>{mealInfo.CAL_INFO}</p>
                        </MenuContainer>
                    ))
                ) : (
                    <p>다음 7일간 급식 정보가 없습니다.</p>
                )}
            </WrapMealInfoContainer>
        </>
    );
};

export default EducationMealServiceDietInfo;





