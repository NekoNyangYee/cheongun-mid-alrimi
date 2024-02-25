import { NextApiRequest, NextApiResponse } from 'next';
import { SchoolScheduleQueryParams, SchoolScheduleResponse, TimeTableQueryParams, TimeTableResponse } from '@/interfaces/Interface';
import { BASE_URL } from '../utils/constants';

const fetchData = async <T>(endpoint: string, queryParams: any): Promise<T> => {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${BASE_URL}/${endpoint}?${queryString}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const fetchTimeTable = async (queryParams: TimeTableQueryParams): Promise<TimeTableResponse[]> => {
    return fetchData<TimeTableResponse[]>('misTimetable', queryParams);
};

export const fetchSchoolSchedule = async (queryParams: SchoolScheduleQueryParams): Promise<SchoolScheduleResponse[]> => {
    return fetchData<SchoolScheduleResponse[]>('SchoolSchedule', queryParams);
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { endpoint, ...queryParams } = req.query;

    try {
        let data;
        switch (endpoint) {
            case 'misTimetable':
                data = await fetchTimeTable({
                    ATPT_OFCDC_SC_CODE: queryParams.ATPT_OFCDC_SC_CODE as string,
                    SD_SCHUL_CODE: queryParams.SD_SCHUL_CODE as string
                });
                break;
            case 'SchoolSchedule':
                data = await fetchSchoolSchedule(queryParams as SchoolScheduleQueryParams);
                break;
            default:
                res.status(404).json({ message: 'Unsupprted endpoint' });
                return;
        }
    }
}