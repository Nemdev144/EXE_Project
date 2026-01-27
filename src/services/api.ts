import axios from "axios";
import type {
  ApiResponse,
  HomePageResponse,
  Province,
  Tour,
  CultureItem,
  Artisan,
  BlogPost,
  Video,
} from "../types";

// API Base Configuration
const API_BASE_URL = "https://exe-1-k8ma.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // Render.com free tier cold start can be slow
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    console.log(`[API] 🚀 ${config.method?.toUpperCase()} ${config.url}`);
    const token = localStorage.getItem("accessToken");
    if (token) {
      // axios types: headers can be undefined
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("[API] ❌ Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);


// ========== Home API ==========
export const getHomePageData = async (limit = 10): Promise<HomePageResponse> => {
  const response = await api.get<ApiResponse<HomePageResponse>>(
    `/api/public/home?limit=${limit}`
  );
  return response.data.data;
};

// ========== Provinces API ==========
export const getProvinces = async (): Promise<Province[]> => {
  const response = await api.get<ApiResponse<Province[]>>(
    "/api/provinces/public"
  );
  return response.data.data;
};

export const getProvinceById = async (id: number): Promise<Province> => {
  const response = await api.get<ApiResponse<Province>>(
    `/api/provinces/public/${id}`
  );
  return response.data.data;
};

export const getProvinceBySlug = async (slug: string): Promise<Province> => {
  const response = await api.get<ApiResponse<Province>>(
    `/api/provinces/public/slug/${slug}`
  );
  return response.data.data;
};

// ========== Tours API ==========
export const getTours = async (): Promise<Tour[]> => {
  const response = await api.get<ApiResponse<Tour[]>>("/api/tours/public");
  return response.data.data;
};

export const getTourById = async (id: number): Promise<Tour> => {
  const response = await api.get<ApiResponse<Tour>>(`/api/tours/public/${id}`);
  return response.data.data;
};

export const getToursByProvince = async (provinceId: number): Promise<Tour[]> => {
  const response = await api.get<ApiResponse<Tour[]>>(
    `/api/tours/public/province/${provinceId}`
  );
  return response.data.data;
};

// ========== Culture Items API ==========
export const getCultureItems = async (): Promise<CultureItem[]> => {
  const response = await api.get<ApiResponse<CultureItem[]>>(
    "/api/culture-items/public"
  );
  return response.data.data;
};

export const getCultureItemById = async (id: number): Promise<CultureItem> => {
  const response = await api.get<ApiResponse<CultureItem>>(
    `/api/culture-items/public/${id}`
  );
  return response.data.data;
};

export const getCultureItemsByProvince = async (
  provinceId: number
): Promise<CultureItem[]> => {
  const response = await api.get<ApiResponse<CultureItem[]>>(
    `/api/culture-items/public/province/${provinceId}`
  );
  return response.data.data;
};

// ========== Artisans API ==========
export const getArtisans = async (): Promise<Artisan[]> => {
  const response = await api.get<ApiResponse<Artisan[]>>("/api/artisans/public");
  return response.data.data;
};

export const getArtisanById = async (id: number): Promise<Artisan> => {
  const response = await api.get<ApiResponse<Artisan>>(
    `/api/artisans/public/${id}`
  );
  return response.data.data;
};

// ========== Blog Posts API ==========
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await api.get<ApiResponse<BlogPost[]>>(
    "/api/blog-posts/public"
  );
  return response.data.data;
};

export const getBlogPostById = async (id: number): Promise<BlogPost> => {
  const response = await api.get<ApiResponse<BlogPost>>(
    `/api/blog-posts/public/${id}`
  );
  return response.data.data;
};

// ========== Videos API ==========
export const getVideos = async (): Promise<Video[]> => {
  const response = await api.get<ApiResponse<Video[]>>("/api/videos/public");
  return response.data.data;
};

export const getVideoById = async (id: number): Promise<Video> => {
  const response = await api.get<ApiResponse<Video>>(`/api/videos/public/${id}`);
  return response.data.data;
};

export default api;
