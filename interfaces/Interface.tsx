export interface BasicSchoolInfo {
    ATPT_OFCDC_SC_CODE: string;
    SD_SCHUL_CODE: string;
}

export interface BasicRequestParams extends BasicSchoolInfo {
    KEY: string;
    Type: string;
    pIndex: number;
}

export interface BasicDateRange {
    AA_FROM_YMD?: string;
    AA_TO_YMD?: string;
}

export interface BasicResponse {
    ATPT_OFCDC_SC_CODE: string;
    ATPT_OFCDC_SC_NM: string;
    SD_SCHUL_CODE: string;
    SCHUL_NM: string;
    LOAD_DTM: string;
}

export interface TimeTableQueryParams extends BasicSchoolInfo {
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

export interface TimeTableResponse extends BasicResponse {
    AY: string;
    SEM: string;
    ALL_TI_YMD: string;
    DGHT_CRSE_SC_NM: string;
    GRADE: string;
    CLASS_NM: string;
    PERIO: string;
    ITRT_CNTNT: string;
}

export interface SchoolScheduleQueryParams extends BasicRequestParams, BasicDateRange {
    DGHT_CRSE_SC_NM?: string;
    SCHUL_CRSE_SC_NM?: string;
    AA_YMD?: string;
}

export interface SchoolScheduleResponse {
    SCHUL_NM?: string;
    DGHT_CRSE_SC_NM?: string;
    SCHUL_CRSE_SC_NM?: string;
    AA_YMD?: string;
    EVENT_NM?: string;
    EVENT_CNTNT?: string;
    AA_FROM_YMD?: string;
    AA_TO_YMD?: string;
}

export interface ClassInfoRequestParams extends BasicRequestParams {
    AY?: string;
    GRADE?: string;
    DGHT_CRSE_SC_NM?: string;
    SCHUL_CRSE_SC_NM?: string;
    ORD_SC_NM?: string;
    DDDEP_NM?: string;
}

export interface ClassInfoResponse {
    AY: string;
    GRADE: number;
    CLASS_NM: number;
    DGHT_CRSE_SC_NM?: string;
    DDDEP_NM?: string;
}

export interface MealServiceDietInfoParams extends BasicRequestParams {
    MMEAL_SC_CODE?: string;
    MLSV_YMD?: string;
    MLSV_FROM_YMD?: string;
    MLSV_TO_YMD?: string;
}

export interface MealServiceDietInfoResponse extends BasicResponse {
    MMEAL_SC_CODE?: string;
    MMEAL_SC_NM?: string;
    MLSV_YMD?: string;
    MLSV_FGR?: string;
    DDISH_NM?: string;
    ORPLC_INFO?: string;
    CAL_INFO?: string;
    NTR_INFO?: string;
    MLSV_FROM_YMD?: string;
    MLSV_TO_YMD?: string;
}
