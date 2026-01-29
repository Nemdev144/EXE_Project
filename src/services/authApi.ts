import { api } from "./api";
import type { ApiResponse } from "../types";

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

// Auth API functions
export const authLogin = async (data: LoginRequest): Promise<ApiResponse<any>> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const authRegister = async (data: RegisterRequest): Promise<ApiResponse<any>> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const authGoogleLogin = async (data: GoogleLoginRequest): Promise<ApiResponse<any>> => {
  const response = await api.post("/auth/google-login", data);
  return response.data;
};

export const authForgotPassword = async (data: ForgotPasswordRequest): Promise<ApiResponse<any>> => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const authVerifyOtp = async (data: VerifyOtpRequest): Promise<ApiResponse<any>> => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

export const authResetPassword = async (data: ResetPasswordRequest): Promise<ApiResponse<any>> => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
