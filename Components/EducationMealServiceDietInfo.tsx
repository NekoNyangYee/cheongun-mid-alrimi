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

    &::-webkit-scrollbar {
        display: none;
    }

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
  background-color: transparent;
  border: 1px solid #E4E4E7;
  padding: 8px;
  cursor: pointer;
  margin: 16px 0;
  border-radius: 50px;
  line-height: 0;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #E4E4E7;
  }
`;

const ScrollBtnContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
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
            const targetDate: Date = new Date(startDate);
            targetDate.setDate(targetDate.getDate() + index);
            const dateStr: string = `${targetDate.getFullYear()}${(targetDate.getMonth() + 1).toString().padStart(2, '0')}${targetDate.getDate().toString().padStart(2, '0')}`;
            const mealForDate: MealInfo | undefined = meals.find(meal => meal.MLSV_YMD === dateStr);

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
            let newScrollPosition: number = scrollLeft + offset;

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
        <div>
            <WrapMealUnfoTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11.9365 13.1038L4.86344 20.1269C4.72497 20.2653 4.55349 20.3387 4.34901 20.3471C4.14454 20.3554 3.96474 20.282 3.80961 20.1269C3.66474 19.982 3.59231 19.8064 3.59231 19.6C3.59231 19.3936 3.66474 19.2179 3.80961 19.0731L13.475 9.40767C13.1558 8.65639 13.0981 7.86632 13.3019 7.03747C13.5058 6.20864 13.9583 5.45384 14.6596 4.77307C15.4275 4.00512 16.3275 3.5205 17.3596 3.31922C18.3916 3.11794 19.2429 3.35255 19.9134 4.02307C20.584 4.69357 20.8186 5.54485 20.6173 6.5769C20.416 7.60895 19.9314 8.50894 19.1634 9.27687C18.4827 9.97815 17.7279 10.4307 16.899 10.6346C16.0702 10.8384 15.2801 10.7807 14.5288 10.4615L12.9903 12L20.0634 19.0731C20.2019 19.2115 20.2753 19.383 20.2836 19.5875C20.2919 19.792 20.2186 19.9718 20.0634 20.1269C19.9186 20.2718 19.7429 20.3426 19.5365 20.3394C19.3301 20.3362 19.1545 20.2653 19.0096 20.1269L11.9365 13.1038ZM7.34421 12.1615L4.45961 9.27687C3.83654 8.6538 3.42693 7.85702 3.23076 6.88652C3.03461 5.916 3.18846 5.04614 3.69231 4.27692C3.84999 4.03334 4.07179 3.89488 4.35769 3.86155C4.64357 3.82821 4.88844 3.9186 5.09229 4.1327L10.2173 9.28845L7.34421 12.1615Z" fill="black" />
                </svg>
                <MealTitle>급식 정보</MealTitle>
            </WrapMealUnfoTitle>
            <WrapMealInfoContainer ref={wrapMealInfoContainerRef}>
                {Array.from({ length: 7 }).map((_, index) => (
                    <MenuContainer key={index}>
                        {isLoading ? (
                            <h2>날짜 불러오는 중..</h2>
                        ) : mealInfos[index] ? (
                            <h2>{new Date(Number(mealInfos[index].MLSV_YMD.slice(0, 4)), parseInt(mealInfos[index].MLSV_YMD.slice(4, 6)) - 1, Number(mealInfos[index].MLSV_YMD.slice(6, 8)))
                                .toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }) + " 점심"}
                            </h2>

                        ) : (
                            <h2>날짜 정보 없음</h2>
                        )}
                        {isLoading ? (
                            <p>급식 정보 불러오는 중...</p>
                        ) : mealInfos[index] ? (
                            <>
                                <p>{mealInfos[index].DDISH_NM.replace(/<br\/>/g, '\n')}</p>
                                <p>{mealInfos[index].CAL_INFO}</p>
                            </>
                        ) : (
                            <p>급식 정보 없음</p>
                        )}
                    </MenuContainer>
                ))}
            </WrapMealInfoContainer>
            <ScrollBtnContainer>
                <ScrollButton onClick={() => scrollContainer(-200)} disabled={isLeftDisabled}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M11.0538 12L15.1269 7.92689C15.2654 7.78844 15.3362 7.6144 15.3394 7.40479C15.3426 7.19519 15.2718 7.01795 15.1269 6.87309C14.982 6.7282 14.8064 6.65576 14.6 6.65576C14.3936 6.65576 14.218 6.7282 14.0731 6.87309L9.57889 11.3673C9.48529 11.4609 9.41926 11.5596 9.38081 11.6635C9.34235 11.7673 9.32311 11.8795 9.32311 12C9.32311 12.1205 9.34235 12.2327 9.38081 12.3365C9.41926 12.4404 9.48529 12.5391 9.57889 12.6327L14.0731 17.1269C14.2116 17.2654 14.3856 17.3362 14.5952 17.3394C14.8048 17.3426 14.982 17.2718 15.1269 17.1269C15.2718 16.982 15.3442 16.8064 15.3442 16.6C15.3442 16.3936 15.2718 16.218 15.1269 16.0731L11.0538 12Z" fill="#18181B" />
                    </svg>
                </ScrollButton>
                <ScrollButton onClick={() => scrollContainer(200)} disabled={isRightDisabled}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12.9462 12L8.87309 7.92689C8.73462 7.78844 8.66379 7.6144 8.66059 7.40479C8.65737 7.19519 8.7282 7.01795 8.87309 6.87309C9.01795 6.7282 9.19359 6.65576 9.39999 6.65576C9.60639 6.65576 9.78202 6.7282 9.92689 6.87309L14.4211 11.3673C14.5147 11.4609 14.5807 11.5596 14.6192 11.6635C14.6577 11.7673 14.6769 11.8795 14.6769 12C14.6769 12.1205 14.6577 12.2327 14.6192 12.3365C14.5807 12.4404 14.5147 12.5391 14.4211 12.6327L9.92689 17.1269C9.78844 17.2654 9.6144 17.3362 9.40479 17.3394C9.19519 17.3426 9.01795 17.2718 8.87309 17.1269C8.7282 16.982 8.65576 16.8064 8.65576 16.6C8.65576 16.3936 8.7282 16.218 8.87309 16.0731L12.9462 12Z" fill="#18181B" />
                    </svg>
                </ScrollButton>
            </ScrollBtnContainer>
        </div>
    );
};

export default EducationMealServiceDietInfo;
