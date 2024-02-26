export interface TimeTableQueryParams {
    ATPT_OFCDC_SC_CODE: string;
    SD_SCHUL_CODE: string;
    AY?: string;
    SEM?: string;
    ALL_TI_YMD?: string;
    DGHT_CRSE_SC_NM?: string;
    GRADE?: string;
    CLASS_NM?: string;
    PERIO?: string;
    TI_FROM_YMD?: string;
    TI_TO_YMD?: string;
}

export interface TimeTableResponse {
    ATPT_OFCDC_SC_CODE: string;
    ATPT_OFCDC_SC_NM: string;
    SD_SCHUL_CODE: string;
    SCHUL_NM: string;
    AY: string;
    SEM: string;
    ALL_TI_YMD: string;
    DGHT_CRSE_SC_NM: string;
    GRADE: string;
    CLASS_NM: string;
    PERIO: string;
    ITRT_CNTNT: string;
    LOAD_DTM: string;
}

export interface SchoolScheduleQueryParams {
    KEY: string;
    Type?: string;
    pIndex?: number;
    pSize?: number;
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

export interface ClassInfoRequestParams {
    KEY: string; // 인증키, 필수
    Type: string; // 호출 문서 타입, 필수
    pIndex: number; // 페이지 위치, 필수
    pSize: number; // 페이지 당 신청 숫자, 필수
    ATPT_OFCDC_SC_CODE?: string; // 시도교육청코드, 필수
    SD_SCHUL_CODE?: string; // 행정표준코드, 필수
    AY?: string; // 학년도, 선택
    GRADE?: string; // 학년, 선택
    DGHT_CRSE_SC_NM?: string; // 주야과정명, 선택
    SCHUL_CRSE_SC_NM?: string; // 학교과정명, 선택
    ORD_SC_NM?: string; // 계열명, 선택
    DDDEP_NM?: string; // 학과명, 선택
}

export interface ClassInfoResponse {
    AY: string; // 학년도
    GRADE: number; // 학년
    CLASS_NM: number; // 반 번호
    DGHT_CRSE_SC_NM?: string; // 과정명 (일반고, 특성화고 등)
    DDDEP_NM?: string; // 학과명
}