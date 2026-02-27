import { api } from "./api";
import type { ApiResponse, PublicArtisan } from "../types";

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
