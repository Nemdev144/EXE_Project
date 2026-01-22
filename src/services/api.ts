import { ApiResponse, HomePageResponse, Tour, Province } from "../types";

const BASE_URL = "https://exe-1-k8ma.onrender.com/api";

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorBody}`);
    }

    const result = await response.json();
    return result;
}

export const homeService = {
    getHomePageData: async (limit: number = 10): Promise<HomePageResponse> => {
        const response = await fetchApi<ApiResponse<HomePageResponse>>(`/public/home?limit=${limit}`);
        return response.data;
    },
};

export const tourService = {
    // Get all tours with optional filters
    getTours: async (params?: {
        provinceId?: number;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{ tours: Tour[]; total: number; page: number; limit: number }> => {
        const queryParams = new URLSearchParams();
        if (params?.provinceId) queryParams.append('provinceId', params.provinceId.toString());
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await fetchApi<ApiResponse<{ tours: Tour[]; total: number; page: number; limit: number }>>(`/public/tours${queryString}`);
        return response.data;
    },

    // Get a single tour by ID
    getTourById: async (id: number): Promise<Tour> => {
        const response = await fetchApi<ApiResponse<Tour>>(`/public/tours/${id}`);
        return response.data;
    },
};

export const provinceService = {
    // Get all provinces
    getProvinces: async (): Promise<Province[]> => {
        const response = await fetchApi<ApiResponse<Province[]>>('/public/provinces');
        return response.data;
    },

    // Get province by ID
    getProvinceById: async (id: number): Promise<Province> => {
        const response = await fetchApi<ApiResponse<Province>>(`/public/provinces/${id}`);
        return response.data;
    },
};

export const getHomePageData = homeService.getHomePageData;
