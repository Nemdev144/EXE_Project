import { api } from "./api";
import type { ApiResponse, PublicArtisan, ArtisanDetail } from "../types";

/**
 * GET /api/artisans/public
 * Fetch all public artisans
 */
export const getPublicArtisans = async (): Promise<PublicArtisan[]> => {
  const res = await api.get<ApiResponse<PublicArtisan[]>>(
    "/api/artisans/public"
  );
  return res.data.data;
};

/**
 * GET /api/artisans/public/{id}
 * Fetch a single public artisan by ID
 */
export const getPublicArtisanById = async (
  id: number
): Promise<PublicArtisan> => {
  const res = await api.get<ApiResponse<PublicArtisan>>(
    `/api/artisans/public/${id}`
  );
  return res.data.data;
};

/**
 * GET /api/artisans/public/{id}/detail
 * Fetch full artisan detail with narrative, related tours, culture items, etc.
 */
export const getArtisanDetail = async (
  id: number
): Promise<ArtisanDetail> => {
  const res = await api.get<ApiResponse<ArtisanDetail>>(
    `/api/artisans/public/${id}/detail`
  );
  return res.data.data;
};
