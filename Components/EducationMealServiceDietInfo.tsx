"use client";

import React, { useState, useEffect } from "react";

const EducationMealServiceDietInfo: React.FC = () => {
    const [mealInfo, setMealInfo] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMealData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const currentDate = new Date();
                const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;

                const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
                const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
                const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;

                const response = await fetch(`/api/education?endpoint=mealServiceDietInfo&KEY=${API_KEY}&Type=json&pIndex=1&pSize=5&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&MLSV_YMD=${formattedDate}`);

                if (!response.ok) {
                    throw new Error('데이터를 불러오는 중에 오류가 발생했습니다.');
                }

                const data = await response.json();
                const todayMealInfo = data.mealServiceDietInfo[1].row.find((item: any) => item.MLSV_YMD === formattedDate);

                setMealInfo(todayMealInfo);
            } catch (error) {
                setError('알 수 없는 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMealData();
    }, []);

    return (
        <div>
            <h1>오늘의 급식 정보</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : mealInfo ? (
                <div>
                    <p>급식 인원수: {mealInfo.MLSV_FGR}</p>
                    <p>요리 명: {mealInfo.DDISH_NM.replace(/<br\/>/g, ', ')}</p>
                </div>
            ) : (
                <p>오늘은 급식이 없는 날이에요.</p>
            )}
        </div>
    );
};

export default EducationMealServiceDietInfo;




