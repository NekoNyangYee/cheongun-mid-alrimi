"use client";

import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";

const WrapMealUnfoTitle = styled.div(() => `
    display: flex;
    align-items: center;
    gap: 6px;
`);

const MealTitle = styled.h1(() => `
    font-size: 1rem;
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
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border: 1px solid #E4E4E7;
    border-radius: 12px;
    width: 232px; 
    box-sizing: border-box; 
    justify-content: space-between;
    flex: 1 0 auto; 
    min-height: 100px;
    gap: 16px;
    
    & p {
        margin: 0;
        color: #71717A;
        font-weight: bold;
        font-size: 0.9rem;
        white-space: pre-wrap;
        font-weight: normal;
    }

    & h2 {
        margin: 0;
        font-size: 1rem;
    }
`);

const ScrollButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  margin: 5px;
  border-radius: 5px;

  &:hover {
    background-color: #e0e0e0;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

interface MealInfo {
    MLSV_YMD: string;
    DDISH_NM: string;
    CAL_INFO: string;
}

const EducationMealServiceDietInfo = () => {
    const [mealInfos, setMealInfos] = useState<MealInfo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const wrapMealInfoContainerRef = useRef<HTMLDivElement>(null);
    const [isLeftDisabled, setIsLeftDisabled] = useState<boolean>(true);
    const [isRightDisabled, setIsRightDisabled] = useState<boolean>(true);

    useEffect(() => {
        const fetchMealData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
                const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
                const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
                const today = new Date();
                const todayStr = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
                const response = await fetch(`/api/education?endpoint=mealServiceDietInfo&KEY=${API_KEY}&Type=json&pIndex=1&pSize=365&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${today.getFullYear()}`);

                if (!response.ok) {
                    throw new Error('데이터를 불러오는 중에 오류가 발생했습니다.');
                }

                const data = await response.json();
                if (data.mealServiceDietInfo && data.mealServiceDietInfo[1].row) {
                    let meals: MealInfo[] = data.mealServiceDietInfo[1].row.filter((meal: { MLSV_YMD: string; }) => meal.MLSV_YMD >= todayStr);
                    const filledMeals = fillMissingDates(meals, today);
                    setMealInfos(filledMeals.slice(0, 7));
                }
            } catch (error: any) {
                setError('급식표를 준비중에요.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMealData();
    }, []);

    const fillMissingDates = (meals: MealInfo[], startDate: Date): MealInfo[] => {
        return Array.from({ length: 7 }).map((_, index) => {
            const targetDate = new Date(startDate);
            targetDate.setDate(targetDate.getDate() + index);
            const dateStr = `${targetDate.getFullYear()}${(targetDate.getMonth() + 1).toString().padStart(2, '0')}${targetDate.getDate().toString().padStart(2, '0')}`;
            const mealForDate = meals.find(meal => meal.MLSV_YMD === dateStr);

            if (mealForDate) {
                return mealForDate;
            } else {
                return {
                    MLSV_YMD: dateStr,
                    DDISH_NM: "이 날은 급식이 없어요",
                    CAL_INFO: "",
                };
            }
        });
    };

    useEffect(() => {
        if (!isLoading) checkScrollPosition(); // 로딩이 완료된 후에 실행
    }, [mealInfos, isLoading]); // 의존성 배열에 isLoading 추가

    const checkScrollPosition = () => {
        if (wrapMealInfoContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = wrapMealInfoContainerRef.current;
            setIsLeftDisabled(scrollLeft <= 0);
            setIsRightDisabled(scrollLeft + clientWidth >= scrollWidth - 1); // 정밀도 문제로 -1 또는 작은 값을 사용
        }
    };

    const scrollContainer = (offset: number) => {
        if (wrapMealInfoContainerRef.current) {
            // 현재 스크롤 위치와 컨테이너의 너비를 계산하여 이동 거리 조절
            const { scrollLeft, clientWidth, scrollWidth } = wrapMealInfoContainerRef.current;
            let newScrollPosition = scrollLeft + offset;

            if (newScrollPosition < 0) {
                newScrollPosition = 0; // 왼쪽 끝으로 이동
            } else if (newScrollPosition + clientWidth > scrollWidth) {
                newScrollPosition = scrollWidth - clientWidth; // 오른쪽 끝으로 이동
            }

            wrapMealInfoContainerRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 200); // 스크롤 이동 후 위치 확인
        }
    };
    return (
        <>
            <WrapMealUnfoTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11.9365 13.1038L4.86344 20.1269C4.72497 20.2653 4.55349 20.3387 4.34901 20.3471C4.14454 20.3554 3.96474 20.282 3.80961 20.1269C3.66474 19.982 3.59231 19.8064 3.59231 19.6C3.59231 19.3936 3.66474 19.2179 3.80961 19.0731L13.475 9.40767C13.1558 8.65639 13.0981 7.86632 13.3019 7.03747C13.5058 6.20864 13.9583 5.45384 14.6596 4.77307C15.4275 4.00512 16.3275 3.5205 17.3596 3.31922C18.3916 3.11794 19.2429 3.35255 19.9134 4.02307C20.584 4.69357 20.8186 5.54485 20.6173 6.5769C20.416 7.60895 19.9314 8.50894 19.1634 9.27687C18.4827 9.97815 17.7279 10.4307 16.899 10.6346C16.0702 10.8384 15.2801 10.7807 14.5288 10.4615L12.9903 12L20.0634 19.0731C20.2019 19.2115 20.2753 19.383 20.2836 19.5875C20.2919 19.792 20.2186 19.9718 20.0634 20.1269C19.9186 20.2718 19.7429 20.3426 19.5365 20.3394C19.3301 20.3362 19.1545 20.2653 19.0096 20.1269L11.9365 13.1038ZM7.34421 12.1615L4.45961 9.27687C3.83654 8.6538 3.42693 7.85702 3.23076 6.88652C3.03461 5.916 3.18846 5.04614 3.69231 4.27692C3.84999 4.03334 4.07179 3.89488 4.35769 3.86155C4.64357 3.82821 4.88844 3.9186 5.09229 4.1327L10.2173 9.28845L7.34421 12.1615Z" fill="black" />
                </svg>
                <MealTitle>급식 정보</MealTitle>
            </WrapMealUnfoTitle>
            <WrapMealInfoContainer ref={wrapMealInfoContainerRef} onScroll={checkScrollPosition}>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
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
            <ScrollButton onClick={() => scrollContainer(-200)} disabled={isLeftDisabled}>왼쪽</ScrollButton>
            <ScrollButton onClick={() => scrollContainer(200)} disabled={isRightDisabled}>오른쪽</ScrollButton>
        </>
    );
};

export default EducationMealServiceDietInfo;
