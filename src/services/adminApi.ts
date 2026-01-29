import api from "./api";
import type { ApiResponse } from "../types";

// ========== Admin Auth API ==========
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    status: string;
  };
}

export const adminLogin = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/api/admin/auth/login",
    data,
  );
  return response.data.data;
};

export const adminLogout = async (): Promise<void> => {
  await api.post("/api/admin/auth/logout");
};

// ========== Admin Tours API ==========
export interface AdminTour {
  id: number;
  title: string;
  description: string;
  provinceId: number;
  provinceName?: string;
  price: number;
  originalPrice?: number;
  minParticipants: number;
  maxParticipants: number;
  durationHours: number;
  status: "OPEN" | "NEAR_DEADLINE" | "FULL" | "NOT_ENOUGH" | "CANCELLED";
  thumbnailUrl: string;
  images: string[];
  artisanId?: number;
  artisanName?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTourRequest {
  title: string;
  description: string;
  provinceId: number;
  price: number;
  originalPrice?: number;
  minParticipants: number;
  maxParticipants: number;
  durationHours: number;
  thumbnailUrl: string;
  images: string[];
  artisanId?: number;
  startDate: string;
  endDate: string;
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> {
  id: number;
}

export const getAdminTours = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  provinceId?: number;
}): Promise<{ data: AdminTour[]; total: number }> => {
  const response = await api.get<
    ApiResponse<{ tours: AdminTour[]; total: number }>
  >("/api/admin/tours", { params });
  return {
    data: response.data.data.tours || response.data.data,
    total: response.data.data.total || 0,
  };
};

export const getAdminTourById = async (id: number): Promise<AdminTour> => {
  const response = await api.get<ApiResponse<AdminTour>>(
    `/api/admin/tours/${id}`,
  );
  return response.data.data;
};

export const createTour = async (
  data: CreateTourRequest,
): Promise<AdminTour> => {
  const response = await api.post<ApiResponse<AdminTour>>(
    "/api/admin/tours",
    data,
  );
  return response.data.data;
};

export const updateTour = async (
  id: number,
  data: Partial<CreateTourRequest>,
): Promise<AdminTour> => {
  const response = await api.put<ApiResponse<AdminTour>>(
    `/api/admin/tours/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteTour = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/tours/${id}`);
};

// ========== Admin Bookings API ==========
export interface AdminBooking {
  id: number;
  tourId: number;
  tourTitle?: string;
  userId: number;
  customerName: string;
  email: string;
  phone: string;
  participants: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  bookingDate: string;
  tourDate: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  tourId: number;
  userId: number;
  participants: number;
  tourDate: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  status?: "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";
  notes?: string;
}

export const getAdminBookings = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  tourId?: number;
  startDate?: string;
  endDate?: string;
}): Promise<{ data: AdminBooking[]; total: number }> => {
  const response = await api.get<
    ApiResponse<{ bookings: AdminBooking[]; total: number }>
  >("/api/admin/bookings", { params });
  return {
    data: response.data.data.bookings || response.data.data,
    total: response.data.data.total || 0,
  };
};

export const getAdminBookingById = async (
  id: number,
): Promise<AdminBooking> => {
  const response = await api.get<ApiResponse<AdminBooking>>(
    `/api/admin/bookings/${id}`,
  );
  return response.data.data;
};

export const updateBooking = async (
  id: number,
  data: UpdateBookingRequest,
): Promise<AdminBooking> => {
  const response = await api.put<ApiResponse<AdminBooking>>(
    `/api/admin/bookings/${id}`,
    data,
  );
  return response.data.data;
};

export const cancelBooking = async (
  id: number,
  reason?: string,
): Promise<AdminBooking> => {
  const response = await api.post<ApiResponse<AdminBooking>>(
    `/api/admin/bookings/${id}/cancel`,
    { reason },
  );
  return response.data.data;
};

export const refundBooking = async (
  id: number,
  amount?: number,
): Promise<AdminBooking> => {
  const response = await api.post<ApiResponse<AdminBooking>>(
    `/api/admin/bookings/${id}/refund`,
    { amount },
  );
  return response.data.data;
};

// ========== Admin Users API ==========
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role: "CUSTOMER" | "USER" | "ADMIN" | "STAFF" | "ARTISAN";
  status: "ACTIVE" | "LOCKED" | "INACTIVE";
  createdAt: string;
  lastLogin?: string;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  role: "USER" | "ADMIN" | "STAFF" | "ARTISAN";
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  role?: "CUSTOMER" | "USER" | "ADMIN" | "STAFF" | "ARTISAN";
  status?: "ACTIVE" | "LOCKED" | "INACTIVE";
}

export const getAdminUsers = async (params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}): Promise<{ data: AdminUser[]; total: number }> => {
  try {
    console.log("[getAdminUsers] 🚀 Request params:", params);
    console.log("[getAdminUsers] 🚀 Full URL:", `/api/users`);

    const response = await api.get<ApiResponse<AdminUser[]>>("/api/users", {
      params,
    });

    console.log("[getAdminUsers] ✅ Full response:", response);
    console.log("[getAdminUsers] ✅ Response status:", response.status);
    console.log("[getAdminUsers] ✅ Response headers:", response.headers);
    console.log(
      "[getAdminUsers] ✅ Response data:",
      JSON.stringify(response.data, null, 2),
    );

    const responseData = response.data.data;
    console.log(
      "[getAdminUsers] ✅ Response data.data:",
      JSON.stringify(responseData, null, 2),
    );

    // Response data is an array directly
    if (Array.isArray(responseData)) {
      console.log(
        "[getAdminUsers] ✅ Parsed as array, length:",
        responseData.length,
      );
      return {
        data: responseData,
        total: responseData.length,
      };
    }

    // Fallback for other formats
    console.warn(
      "[getAdminUsers] ⚠️ Response data is not an array:",
      typeof responseData,
    );
    return {
      data: [],
      total: 0,
    };
  } catch (error: any) {
    console.error("[getAdminUsers] ❌ Error details:", error);
    console.error("[getAdminUsers] ❌ Error response:", error?.response);
    console.error(
      "[getAdminUsers] ❌ Error response data:",
      error?.response?.data,
    );
    console.error(
      "[getAdminUsers] ❌ Error response status:",
      error?.response?.status,
    );
    console.error(
      "[getAdminUsers] ❌ Error response headers:",
      error?.response?.headers,
    );
    console.error("[getAdminUsers] ❌ Error config:", error?.config);
    throw error;
  }
};

export const getAdminUserById = async (id: number): Promise<AdminUser> => {
  const response = await api.get<ApiResponse<AdminUser>>(`/api/users/${id}`);
  return response.data.data;
};

export const createUser = async (
  data: CreateUserRequest,
): Promise<AdminUser> => {
  const response = await api.post<ApiResponse<AdminUser>>(
    "/api/admin/users",
    data,
  );
  return response.data.data;
};

export const updateUser = async (
  id: number,
  data: UpdateUserRequest,
): Promise<AdminUser> => {
  const response = await api.put<ApiResponse<AdminUser>>(
    `/api/admin/users/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/users/${id}`);
};

// ========== Admin Content API ==========
export interface AdminContent {
  id: number;
  title: string;
  slug: string;
  content: string;
  blocksJson?: string;
  featuredImageUrl: string;
  images: string[];
  provinceId?: number;
  provinceName?: string;
  authorId: number;
  authorName?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentRequest {
  title: string;
  content: string;
  blocksJson?: string;
  featuredImageUrl: string;
  images: string[];
  provinceId?: number;
  status: "DRAFT" | "PUBLISHED";
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {
  id: number;
}

export const getAdminContent = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  provinceId?: number;
  search?: string;
}): Promise<{ data: AdminContent[]; total: number }> => {
  const response = await api.get<
    ApiResponse<{ content: AdminContent[]; total: number }>
  >("/api/admin/content", { params });
  return {
    data: response.data.data.content || response.data.data,
    total: response.data.data.total || 0,
  };
};

export const getAdminContentById = async (
  id: number,
): Promise<AdminContent> => {
  const response = await api.get<ApiResponse<AdminContent>>(
    `/api/admin/content/${id}`,
  );
  return response.data.data;
};

export const createContent = async (
  data: CreateContentRequest,
): Promise<AdminContent> => {
  const response = await api.post<ApiResponse<AdminContent>>(
    "/api/admin/content",
    data,
  );
  return response.data.data;
};

export const updateContent = async (
  id: number,
  data: Partial<CreateContentRequest>,
): Promise<AdminContent> => {
  const response = await api.put<ApiResponse<AdminContent>>(
    `/api/admin/content/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteContent = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/content/${id}`);
};

// ========== Admin Artisans API ==========
export interface AdminArtisan {
  id: number;
  userId: number;
  fullName: string;
  specialization: string;
  bio: string;
  profileImageUrl: string;
  images: string[];
  provinceId?: number;
  provinceName?: string;
  workshopAddress?: string;
  averageRating: number;
  totalReviews: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtisanRequest {
  userId: number;
  specialization: string;
  bio: string;
  profileImageUrl: string;
  images: string[];
  provinceId?: number;
  workshopAddress?: string;
}

export interface UpdateArtisanRequest extends Partial<CreateArtisanRequest> {
  id: number;
}

export const getAdminArtisans = async (params?: {
  page?: number;
  limit?: number;
  provinceId?: number;
  status?: string;
}): Promise<{ data: AdminArtisan[]; total: number }> => {
  const response = await api.get<
    ApiResponse<{ artisans: AdminArtisan[]; total: number }>
  >("/api/admin/artisans", { params });
  return {
    data: response.data.data.artisans || response.data.data,
    total: response.data.data.total || 0,
  };
};

export const getAdminArtisanById = async (
  id: number,
): Promise<AdminArtisan> => {
  const response = await api.get<ApiResponse<AdminArtisan>>(
    `/api/admin/artisans/${id}`,
  );
  return response.data.data;
};

export const createArtisan = async (
  data: CreateArtisanRequest,
): Promise<AdminArtisan> => {
  const response = await api.post<ApiResponse<AdminArtisan>>(
    "/api/admin/artisans",
    data,
  );
  return response.data.data;
};

export const updateArtisan = async (
  id: number,
  data: Partial<CreateArtisanRequest>,
): Promise<AdminArtisan> => {
  const response = await api.put<ApiResponse<AdminArtisan>>(
    `/api/admin/artisans/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteArtisan = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/artisans/${id}`);
};

// ========== Admin Dashboard API ==========
export interface DashboardStats {
  totalTours: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  bookingsToday: number;
  toursGrowth: number;
  bookingsGrowth: number;
  revenueGrowth: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<ApiResponse<DashboardStats>>(
    "/api/admin/dashboard/stats",
  );
  return response.data.data;
};
