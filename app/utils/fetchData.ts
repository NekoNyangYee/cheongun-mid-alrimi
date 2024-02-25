import { BASE_URL } from "./constants";

const fetchData = async <T>(endpoint: string, queryParams: Record<string, string | string[]>): Promise<T> => {
    const params = new URLSearchParams();
    Object.keys(queryParams).forEach(key => {
        const value = queryParams[key];
        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
        } else {
            params.append(key, value);
        }
    });

    params.append('Type', 'json');

    const url = `${BASE_URL}${endpoint}?${params.toString()}`;

    const response = await fetch(url);
    const data: T = await response.json();
    return data;
};

export default fetchData;
