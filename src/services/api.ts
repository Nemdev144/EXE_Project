import { ApiResponse, HomePageResponse } from "../types";

const BASE_URL = "https://exe-1-k8ma.onrender.com/api";

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true", // Added based on spec headers
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorBody}`);
  }

  const result = await response.json();
  // The API returns a wrapper object with 'data' field usually containing the actual data, 
  // but sometimes we might want the full response. 
  // Based on the types, ApiResponse<T> has a 'data' field of type T. 
  // However, often convenience methods just return T. 
  // Let's return the full ApiResponse<T> for now to handle success checks.
  return result;
}

export const homeService = {
  getHomePageData: async (limit: number = 10): Promise<HomePageResponse> => {
    const response = await fetchApi<ApiResponse<HomePageResponse>>(`/public/home?limit=${limit}`);
    return response.data;
  },
};

export const getHomePageData = homeService.getHomePageData;
