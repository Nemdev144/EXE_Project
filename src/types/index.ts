// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  errors?: object;
  timestamp: string;
}

// Province
export interface Province {
  id: number;
  name: string;
  slug: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  thumbnailUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tour
export interface Tour {
  id: number;
  provinceId: number;
  provinceName?: string;
  title: string;
  slug: string;
  description: string;
  durationHours: number;
  maxParticipants: number;
  price: number;
  thumbnailUrl: string;
  images: string[];
  artisanId?: number;
  artisanName?: string;
  averageRating: number;
  totalReviews: number;
  totalBookings?: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

// Culture Item
export interface CultureItem {
  id: number;
  provinceId: number;
  provinceName?: string;
  category: CultureCategory;
  title: string;
  description: string;
  thumbnailUrl: string;
  images: string[];
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type CultureCategory =
  | "FESTIVAL"
  | "FOOD"
  | "COSTUME"
  | "INSTRUMENT"
  | "DANCE"
  | "LEGEND"
  | "CRAFT";

// Artisan
export interface Artisan {
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
  createdAt: string;
  updatedAt: string;
}

// Blog Post
export interface BlogPost {
  id: number;
  authorId: number;
  authorName?: string;
  title: string;
  slug: string;
  content: string;
  blocksJson?: string;
  featuredImageUrl: string;
  provinceId?: number;
  provinceName?: string;
  status: string;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Video
export interface Video {
  id: number;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  provinceId?: number;
  provinceName?: string;
  cultureItemId?: number;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// User Memory
export interface UserMemory {
  id: number;
  userId: number;
  userName?: string;
  title: string;
  description: string;
  images: string[];
  audioUrl?: string;
  videoUrl?: string;
  provinceId?: number;
  provinceName?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Review
export interface Review {
  id: number;
  userId: number;
  userName?: string;
  userAvatar?: string;
  bookingId: number;
  tourId: number;
  tourTitle?: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

// Home Page Response
export interface HomePageResponse {
  provinces: Province[];
  featuredTours: Tour[];
  cultureItems: CultureItem[];
  artisans: Artisan[];
  blogPosts: BlogPost[];
  videos: Video[];
  userMemories: UserMemory[];
}

// Tour Schedule
export interface TourSchedule {
  id: number;
  tourId: number;
  tourDate: string;
  startTime: string;
  maxSlots: number;
  bookedSlots: number;
  availableSlots: number;
  currentPrice: number;
  discountPercent: number;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED" | "FULL";
}

// User
export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN" | "STAFF" | "ARTISAN";
  status: string;
  createdAt: string;
}

// Auth
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
