import { Star } from 'lucide-react';

/** Safely parse tour/culture item images (handles JSON strings, arrays, CSV). */
export const parseImages = (images?: string | string[]): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  const trimmed = String(images).trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
};

/** Format a number as Vietnamese currency (no suffix). */
export const formatPrice = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

/** Render 5 stars with active/inactive styling. */
export const renderStars = (rating: number, prefix = 'star') =>
  Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={`${prefix}-${i}`}
      className={`td-star ${i < Math.floor(rating) ? 'td-star--active' : 'td-star--inactive'}`}
    />
  ));
