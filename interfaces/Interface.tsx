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