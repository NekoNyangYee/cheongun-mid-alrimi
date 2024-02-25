export interface TimeTableQueryParams {
    ATPT_OFCDC_SC_CODE: string; // 시도교육청코드
    SD_SCHUL_CODE: string;      // 행정표준코드
    AY?: string;                // 학년도
    SEM?: string;               // 학기
    ALL_TI_YMD?: string;        // 시간표일자
    DGHT_CRSE_SC_NM?: string;   // 주야과정명
    GRADE?: string;             // 학년
    CLASS_NM?: string;          // 학급명
    PERIO?: string;             // 교시
    TI_FROM_YMD?: string;       // 시간표시작일자
    TI_TO_YMD?: string;         // 시간표종료일자
}

export interface TimeTableResponse {
    ATPT_OFCDC_SC_CODE: string; // 시도교육청코드
    ATPT_OFCDC_SC_NM: string;   // 시도교육청명
    SD_SCHUL_CODE: string;      // 행정표준코드
    SCHUL_NM: string;           // 학교명
    AY: string;                 // 학년도
    SEM: string;                // 학기
    ALL_TI_YMD: string;         // 시간표일자
    DGHT_CRSE_SC_NM: string;    // 주야과정명
    GRADE: string;              // 학년
    CLASS_NM: string;           // 학급명
    PERIO: string;              // 교시
    ITRT_CNTNT: string;         // 수업내용
    LOAD_DTM: string;           // 수정일자
}

export interface SchoolScheduleQueryParams {
    KEY: string;
    Type: string;
    pIndex: number;
    pSize: number;
    ATPT_OFCDC_SC_CODE: string;
    SD_SCHUL_CODE: string;
    DGHT_CRSE_SC_NM?: string;
    SCHUL_CRSE_SC_NM?: string;
    AA_YMD?: string;
    AA_FROM_YMD?: string;
    AA_TO_YMD?: string;
}

export interface SchoolScheduleResponse {
    ATPT_OFCDC_SC_CODE: string;
    SD_SCHUL_CODE: string;
    SCHUL_NM?: string;
    DGHT_CRSE_SC_NM?: string;
    SCHUL_CRSE_SC_NM?: string;
    AA_YMD?: string;
    EVENT_NM?: string;
    EVENT_CNTNT?: string;
    AA_FROM_YMD?: string;
    AA_TO_YMD?: string;
}