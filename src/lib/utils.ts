import { type ClassValue, clsx } from "clsx";

// Utility function to merge class names (without Tailwind merge)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
