import { BASE_URL } from "./constants";

// utils/fetchData.ts
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
    // 기본 인자 추가
    params.append('Type', 'json'); // JSON 형식으로 데이터 요청
    params.append('pIndex', '1'); // 페이지 위치
    params.append('pSize', '100'); // 페이지 당 신청 숫자

    // 클라이언트 사이드에서는 API 키를 여기에 포함시키지 않습니다.
    // 서버 사이드 코드에서만 API 키를 추가하는 로직을 구현합니다.

    const url = `${BASE_URL}${endpoint}?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
};

export default fetchData;
