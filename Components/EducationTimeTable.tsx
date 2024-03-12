"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useTimeTableStore } from "@/app/Store/timeTableStore";
import Link from "next/link";

const WrapTimeTableContainer = styled.div(
  () => `
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #E4E4E7;
  border-radius: 12px;
  background-color: #FFFFFF;
  box-sizing: border-box;
  gap: 16px;
`
);

const WrapTimeTableTitle = styled.div(
  () => `
  display: flex;
  align-items: center;
  justify-content: space-between;

  & .timetable-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  & h1 {
    font-size: 1rem;
    margin: 0;
  }

  & a {
    font-size: 0.9rem;
    color: #71717A;
    text-decoration: none;
    display: flex;
    align-items: center;
  }
`
);

const GradeClassNMSettingButton = styled.button`
  background-color: transparent;
  border: transparent;
  cursor: pointer;
  padding: 0;
  line-height: 0;

  & svg {
    width: 20px;
    height: 20px;
  }
`;

const GradeClassNMSelectButton = styled.button`
  padding: 8px 16px;
  background-color: #F4F4F5;
  border: 1px solid #E4E4E7;
  cursor: pointer;
`;

const SelectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex-wrap: wrap;
  margin-top: 20px;
`;

const CurrentSelection = styled.div`
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
`;

const SelectGradeClassNMContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EducationTimeTable = () => {
  const {
    timeTable,
    isLoading,
    selection,
    availableClasses,
    setTimeTable,
    setIsLoading,
    setSelection,
    setAvailableClasses,
  } = useTimeTableStore();

  const [showSelection, setShowSelection] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // 환경 변수에서 필요한 정보를 불러옵니다.
        const OFFICE_CODE = process.env.NEXT_PUBLIC_OFFICE_CODE;
        const SCHOOL_CODE = process.env.NEXT_PUBLIC_SCHOOL_CODE;
        const API_KEY = process.env.NEXT_PUBLIC_MY_API_KEY;
        const currentYear: string = new Date().getFullYear().toString();

        // 현재 날짜를 YYMMDD 형식으로 변환합니다.
        const today: Date = new Date();
        const todayStr: string = `${today.getFullYear()}${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;

        // classInfo 데이터를 불러옵니다.
        const responseClassInfo: Response = await fetch(
          `/api/education?endpoint=classInfo&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&AY=${currentYear}`
        );

        if (!responseClassInfo.ok) {
          throw new Error("Failed to fetch classInfo data");
        }

        const classInfoData = await responseClassInfo.json();

        // 현재 년도에 해당하는 데이터만 필터링합니다.
        const validClasses: [] = classInfoData.classInfo[1].row
          .filter((item: { AY: string }) => item.AY === currentYear)
          .map(
            (item: {
              GRADE: { toString: () => any };
              CLASS_NM: { toString: () => any };
            }) => ({
              GRADE: item.GRADE.toString(),
              CLASS_NM: item.CLASS_NM.toString(),
            })
          );

        setAvailableClasses(validClasses);

        // 선택된 학년과 반에 대한 시간표 데이터를 불러옵니다.
        const responseMisTimetable: Response = await fetch(
          `/api/education?endpoint=misTimetable&KEY=${API_KEY}&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&ALL_TI_YMD=${todayStr}&GRADE=${selection.GRADE}&CLASS_NM=${selection.CLASS_NM}`
        );

        if (!responseMisTimetable.ok) {
          throw new Error("Failed to fetch misTimetable data");
        }

        const misTimetableData = await responseMisTimetable.json();

        // 시간표 데이터를 필터링하여 상태를 업데이트합니다.
        const filteredTimeTable = misTimetableData.misTimetable[1].row.filter(
          (item: { ALL_TI_YMD: string; GRADE: string; CLASS_NM: string }) =>
            item.ALL_TI_YMD === todayStr &&
            item.GRADE === selection.GRADE &&
            item.CLASS_NM === selection.CLASS_NM
        );

        setTimeTable(filteredTimeTable.length > 0 ? filteredTimeTable : null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selection]);

  const toggleShowSelection = () => {
    setShowSelection(!showSelection);
  };

  const handleSelection = (grade: string, classNm: string) => {
    setSelection({ GRADE: grade, CLASS_NM: classNm });
    setShowSelection(false); // 선택 후 선택 옵션 숨김
  };

  return (
    <WrapTimeTableContainer>
      <WrapTimeTableTitle>
        <div className="timetable-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M10.6145 6.74998C10.4218 6.74998 10.2608 6.68532 10.1315 6.55599C10.0022 6.42667 9.9375 6.26418 9.9375 6.06853V3.30645C9.9375 3.11081 10.0027 2.94833 10.133 2.81901C10.2634 2.68967 10.4249 2.625 10.6176 2.625H14.698C14.8906 2.625 15.0516 2.68967 15.181 2.81901C15.3103 2.94833 15.375 3.11081 15.375 3.30645V6.06853C15.375 6.26418 15.3098 6.42667 15.1794 6.55599C15.0491 6.68532 14.8876 6.74998 14.6949 6.74998H10.6145ZM3.30201 9.37496C3.10933 9.37496 2.94833 9.31027 2.81901 9.18088C2.68967 9.05151 2.625 8.89119 2.625 8.69994V3.29987C2.625 3.10862 2.69017 2.94833 2.82052 2.81901C2.95087 2.68967 3.11239 2.625 3.30508 2.625H7.38546C7.57814 2.625 7.73915 2.68969 7.86848 2.81908C7.9978 2.94846 8.06246 3.10877 8.06246 3.30002V8.70009C8.06246 8.89134 7.99729 9.05163 7.86696 9.18096C7.73661 9.31029 7.57509 9.37496 7.3824 9.37496H3.30201ZM10.6145 15.375C10.4218 15.375 10.2608 15.3103 10.1315 15.1809C10.0022 15.0515 9.9375 14.8912 9.9375 14.6999V9.29987C9.9375 9.10862 10.0027 8.94833 10.133 8.81901C10.2634 8.68967 10.4249 8.625 10.6176 8.625H14.698C14.8906 8.625 15.0516 8.68969 15.181 8.81908C15.3103 8.94846 15.375 9.10877 15.375 9.30002V14.7001C15.375 14.8913 15.3098 15.0516 15.1794 15.181C15.0491 15.3103 14.8876 15.375 14.6949 15.375H10.6145ZM3.30201 15.375C3.10933 15.375 2.94833 15.3103 2.81901 15.181C2.68967 15.0516 2.625 14.8892 2.625 14.6935V11.9314C2.625 11.7358 2.69017 11.5733 2.82052 11.444C2.95087 11.3146 3.11239 11.25 3.30508 11.25H7.38546C7.57814 11.25 7.73915 11.3146 7.86848 11.444C7.9978 11.5733 8.06246 11.7358 8.06246 11.9314V14.6935C8.06246 14.8892 7.99729 15.0516 7.86696 15.181C7.73661 15.3103 7.57509 15.375 7.3824 15.375H3.30201Z"
              fill="black"
            />
          </svg>
          <h1>오늘의 시간표</h1>
        </div>
        <Link href="/timetable">
          더보기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M9.70974 8.99999L6.65494 5.94516C6.55109 5.84133 6.49796 5.7108 6.49556 5.55359C6.49315 5.39639 6.54628 5.26346 6.65494 5.15481C6.76359 5.04615 6.89531 4.99182 7.05011 4.99182C7.20491 4.99182 7.33664 5.04615 7.44529 5.15481L10.816 8.52548C10.8862 8.59567 10.9357 8.66971 10.9645 8.7476C10.9934 8.82547 11.0078 8.9096 11.0078 8.99999C11.0078 9.09038 10.9934 9.17451 10.9645 9.25238C10.9357 9.33027 10.8862 9.40431 10.816 9.4745L7.44529 12.8452C7.34145 12.949 7.21092 13.0021 7.05371 13.0045C6.89651 13.007 6.76359 12.9538 6.65494 12.8452C6.54628 12.7365 6.49194 12.6048 6.49194 12.45C6.49194 12.2952 6.54628 12.1635 6.65494 12.0548L9.70974 8.99999Z"
              fill="#71717A"
            />
          </svg>
        </Link>
      </WrapTimeTableTitle>
      {showSelection && (
          <SelectionContainer>
            {availableClasses.map((cls, index) => (
              <GradeClassNMSelectButton
                key={index}
                onClick={() => handleSelection(cls.GRADE, cls.CLASS_NM)}
              >
                {cls.GRADE}학년 {cls.CLASS_NM}반
              </GradeClassNMSelectButton>
            ))}
          </SelectionContainer>
        )}
      <SelectGradeClassNMContainer>
        <CurrentSelection>
          {selection.GRADE}학년 {selection.CLASS_NM}반
        </CurrentSelection>
        <GradeClassNMSettingButton onClick={toggleShowSelection}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M8.16935 16.125C7.91358 16.125 7.69267 16.0401 7.50662 15.8704C7.32057 15.7007 7.20735 15.4918 7.16696 15.2437L6.98379 13.8404C6.78283 13.773 6.57682 13.6788 6.36575 13.5577C6.15469 13.4365 5.96599 13.3067 5.79964 13.1682L4.50011 13.7206C4.26454 13.8245 4.02776 13.8346 3.78979 13.7509C3.55181 13.6673 3.36696 13.5153 3.23524 13.2952L2.39004 11.8298C2.25832 11.6096 2.22034 11.3767 2.2761 11.131C2.33187 10.8853 2.45975 10.6827 2.65974 10.5231L3.78332 9.67931C3.766 9.56778 3.75374 9.45576 3.74653 9.34326C3.73932 9.23076 3.73571 9.11874 3.73571 9.0072C3.73571 8.90046 3.73932 8.79204 3.74653 8.68194C3.75374 8.57184 3.766 8.45141 3.78332 8.32065L2.65974 7.47688C2.45975 7.31727 2.33307 7.11343 2.2797 6.86537C2.22634 6.61729 2.26552 6.38316 2.39726 6.16298L3.23524 4.71923C3.36696 4.50385 3.55181 4.35313 3.78979 4.26707C4.02776 4.18102 4.26454 4.18991 4.50011 4.29375L5.79242 4.83896C5.97319 4.69569 6.16622 4.56468 6.37151 4.44593C6.57681 4.32716 6.7785 4.23173 6.97657 4.15961L7.16696 2.75623C7.20735 2.50817 7.32057 2.29928 7.50662 2.12957C7.69267 1.95986 7.91358 1.875 8.16935 1.875H9.83087C10.0866 1.875 10.3076 1.95986 10.4936 2.12957C10.6797 2.29928 10.7929 2.50817 10.8333 2.75623L11.0164 4.16683C11.2414 4.24856 11.445 4.34399 11.6273 4.45312C11.8095 4.56226 11.9934 4.69088 12.1789 4.83896L13.5073 4.29375C13.7429 4.18991 13.9797 4.18102 14.2177 4.26707C14.4556 4.35313 14.6405 4.50385 14.7722 4.71923L15.6102 6.17019C15.7419 6.39038 15.7799 6.62331 15.7241 6.86897C15.6683 7.11463 15.5405 7.31727 15.3405 7.47688L14.1881 8.34227C14.215 8.46343 14.2297 8.57666 14.2321 8.68194C14.2345 8.78723 14.2357 8.89324 14.2357 8.99998C14.2357 9.10191 14.2333 9.20551 14.2285 9.3108C14.2236 9.41609 14.2063 9.53653 14.1765 9.67211L15.3073 10.5231C15.5073 10.6827 15.6364 10.8853 15.6946 11.131C15.7527 11.3767 15.7159 11.6096 15.5842 11.8298L14.7347 13.2879C14.603 13.5081 14.4169 13.6601 14.1765 13.7437C13.9362 13.8274 13.6982 13.8173 13.4626 13.7134L12.1789 13.161C11.9934 13.3091 11.8039 13.4401 11.6107 13.554C11.4174 13.668 11.2193 13.761 11.0164 13.8331L10.8333 15.2437C10.7929 15.4918 10.6797 15.7007 10.4936 15.8704C10.3076 16.0401 10.0866 16.125 9.83087 16.125H8.16935ZM9.00875 11.25C9.63279 11.25 10.1638 11.031 10.6018 10.593C11.0397 10.155 11.2587 9.62401 11.2587 8.99998C11.2587 8.37596 11.0397 7.84495 10.6018 7.40696C10.1638 6.96899 9.63279 6.75 9.00875 6.75C8.37704 6.75 7.84412 6.96899 7.40998 7.40696C6.97585 7.84495 6.75879 8.37596 6.75879 8.99998C6.75879 9.62401 6.97585 10.155 7.40998 10.593C7.84412 11.031 8.37704 11.25 9.00875 11.25Z"
              fill="#71717A"
            />
          </svg>
        </GradeClassNMSettingButton>
      </SelectGradeClassNMContainer>
      {isLoading ? (
        <p>Loading...</p>
      ) : timeTable.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>교시</th>
              <th>시간표</th>
            </tr>
          </thead>
          <tbody>
            {timeTable.map((item, index) => (
              <tr key={index}>
                <td>{item.PERIO}</td>
                <td>{item.ITRT_CNTNT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>오늘은 시간표가 없습니다.</p>
      )}
    </WrapTimeTableContainer>
  );
};

export default EducationTimeTable;
