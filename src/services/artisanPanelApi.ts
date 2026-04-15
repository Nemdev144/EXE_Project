/**
 * Artisan Panel API - Dành cho role ARTISAN đăng nhập
 * Theo docs/ARTISAN_PANEL_API.md - ưu tiên endpoint /api/artisans/me
 */
import dayjs from "dayjs";
import { api } from "./api";
import type { ApiResponse } from "../types";
import { getCurrentUser } from "./profileApi";
import {
  getAdminArtisans,
  getAdminArtisanDetail,
  getAdminArtisanById,
  getTourSchedules,
  parseScheduleResponse,
  updateArtisan,
  type AdminArtisan,
  type AdminArtisanDetail,
  type AdminTourSchedule,
  type TourScheduleStatus,
  type UpdateArtisanRequest,
} from "./adminApi";

/** GET /api/artisans/me - Lấy artisan của user hiện tại. Fallback: tìm trong danh sách public */
export async function getMyArtisan(): Promise<AdminArtisan | null> {
  try {
    const res = await api.get<ApiResponse<AdminArtisan>>("/api/artisans/me");
    const data = res.data?.data;
    if (data && typeof data === "object" && "id" in data) {
      return data as AdminArtisan;
    }
    return null;
  } catch {
    try {
      const [currentUser, { data: artisans }] = await Promise.all([
        getCurrentUser(),
        getAdminArtisans({ limit: 500 }),
      ]);
      const found = (artisans ?? []).find((a) => a.user?.id === currentUser.id);
      return found ?? null;
    } catch {
      return null;
    }
  }
}

/** Chi tiết nghệ nhân - GET /api/artisans/public/{id}/detail */
export async function getMyArtisanDetail(
  artisanId: number
): Promise<AdminArtisanDetail | null> {
  try {
    return await getAdminArtisanDetail(artisanId);
  } catch {
    return null;
  }
}

/** Thông tin nghệ nhân để chỉnh sửa - GET /api/artisans/{id} hoặc /api/artisans/me */
export async function getMyArtisanForEdit(
  artisanId: number
): Promise<AdminArtisan | null> {
  try {
    const res = await api.get<ApiResponse<AdminArtisan>>("/api/artisans/me");
    const data = res.data?.data;
    if (data && typeof data === "object" && "id" in data) {
      return data as AdminArtisan;
    }
  } catch {
    /* fallback */
  }
  try {
    return await getAdminArtisanById(artisanId);
  } catch {
    return null;
  }
}

export type GetMySchedulesOptions = {
  /** Query `status` — khớp Swagger GET /api/artisans/me/schedules */
  status?: TourScheduleStatus;
};

/** GET /api/artisans/me/schedules - Lịch trình của nghệ nhân. Fallback: filter từ tour-schedules */
export async function getMySchedules(
  artisanId: number,
  options?: GetMySchedulesOptions
): Promise<AdminTourSchedule[]> {
  const params =
    options?.status != null && String(options.status).trim() !== ""
      ? { status: options.status }
      : undefined;
  try {
    const res = await api.get<ApiResponse<unknown>>(
      "/api/artisans/me/schedules",
      { params }
    );
    const raw = res.data?.data;
    const arr = parseScheduleResponse(raw);
    arr.sort(
      (a, b) => dayjs(a.tourDate).valueOf() - dayjs(b.tourDate).valueOf()
    );
    return arr;
  } catch {
    try {
      const { data } = await getTourSchedules({ limit: 500 });
      const forArtisan = (data ?? []).filter((s) => {
        const aid =
          s.tour?.artisan?.id ?? (s.tour as { artisanId?: number })?.artisanId;
        if (aid !== artisanId) return false;
        if (options?.status && s.status !== options.status) return false;
        return true;
      });
      forArtisan.sort(
        (a, b) => dayjs(a.tourDate).valueOf() - dayjs(b.tourDate).valueOf()
      );
      return forArtisan;
    } catch {
      return [];
    }
  }
}

/** Chuẩn hóa payload update - chỉ gửi field có giá trị */
function sanitizeProfilePayload(data: UpdateArtisanRequest): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.fullName != null && String(data.fullName).trim())
    out.fullName = String(data.fullName).trim();
  if (data.specialization != null && String(data.specialization).trim())
    out.specialization = String(data.specialization).trim();
  if (data.bio != null && String(data.bio).trim()) out.bio = String(data.bio).trim();
  if (data.workshopAddress != null && String(data.workshopAddress).trim())
    out.workshopAddress = String(data.workshopAddress).trim();
  if (data.profileImageUrl != null && String(data.profileImageUrl).trim())
    out.profileImageUrl = String(data.profileImageUrl).trim();
  if (data.provinceId != null) out.provinceId = Number(data.provinceId);
  return out;
}

/** PUT /api/artisans/me - Cập nhật profile. Fallback: PUT /api/artisans/{id} */
export async function updateMyArtisanProfile(
  artisanId: number,
  data: UpdateArtisanRequest
): Promise<AdminArtisan> {
  const payload = sanitizeProfilePayload(data);
  try {
    const res = await api.put<ApiResponse<AdminArtisan>>(
      "/api/artisans/me",
      payload
    );
    const result = res.data?.data;
    if (result) return result as AdminArtisan;
  } catch {
    /* fallback */
  }
  return updateArtisan(artisanId, data);
}
