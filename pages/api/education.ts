import { NextApiRequest, NextApiResponse } from 'next';
import { ClassInfoRequestParams, ClassInfoResponse, MealServiceDietInfoParams, MealServiceDietInfoResponse, SchoolScheduleQueryParams, SchoolScheduleResponse, TimeTableQueryParams, TimeTableResponse } from '@/interfaces/Interface';
import fetchData from '../../app/utils/fetchData';

function isClassInfoQeryParams(queryParams: any): queryParams is ClassInfoRequestParams {
    return 'ATPT_OFCDC_SC_CODE' in queryParams && 'SD_SCHUL_CODE' in queryParams;
}

function isTimeTableQueryParams(queryParams: any): queryParams is TimeTableQueryParams {
    return 'ATPT_OFCDC_SC_CODE' in queryParams && 'SD_SCHUL_CODE' in queryParams;
}

function isSchoolScheduleQueryParams(params: any): params is SchoolScheduleQueryParams {
    return 'ATPT_OFCDC_SC_CODE' in params && 'SD_SCHUL_CODE' in params;
}

function ismealServiceDietInfoQueryParams(params: any): params is MealServiceDietInfoParams {
    return 'ATPT_OFCDC_SC_CODE' in params && 'SD_SCHUL_CODE' in params;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { endpoint, ...restQueryParams } = req.query;
    const queryParams = restQueryParams as Record<string, string | string[]>;

    try {
        let data;

        if (endpoint === 'misTimetable' && isTimeTableQueryParams(queryParams)) {
            data = await fetchTimeTable(queryParams);
        } else if (endpoint === 'SchoolSchedule' && isSchoolScheduleQueryParams(queryParams)) {
            data = await fetchSchoolSchedule(queryParams);
        } else if (endpoint === 'classInfo' && isClassInfoQeryParams(queryParams)) {
            data = await fetchClassInfo(queryParams);
        } else if (endpoint === 'mealServiceDietInfo' && ismealServiceDietInfoQueryParams(queryParams)) {
            data = await fetchMealServiceDietInfo(queryParams);
        } else {
            res.status(400).json({ message: 'Invalid query parameters' });
            return;
        }

        res.status(200).json(data);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: 'Internal server error', error: err.message });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const fetchTimeTable = async (queryParams: TimeTableQueryParams): Promise<TimeTableResponse[]> => {
    return fetchData<TimeTableResponse[]>('misTimetable', queryParams as any);
};

export const fetchSchoolSchedule = async (queryParams: SchoolScheduleQueryParams): Promise<SchoolScheduleResponse[]> => {
    return fetchData<SchoolScheduleResponse[]>('SchoolSchedule', queryParams as any);
};

export const fetchClassInfo = async (queryParams: ClassInfoRequestParams): Promise<ClassInfoResponse[]> => {
    return fetchData<ClassInfoResponse[]>('classInfo', queryParams as any);
};

export const fetchMealServiceDietInfo = async (queryParams: MealServiceDietInfoParams): Promise<MealServiceDietInfoResponse[]> => {
    return fetchData<MealServiceDietInfoResponse[]>('mealServiceDietInfo', queryParams as any);
};
