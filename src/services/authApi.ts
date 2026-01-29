import type { ApiResponse, User } from "../types";
import { api } from "./api";

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
};

export type ResetPasswordRequest = {
  email: string;
  otp: string;
  newPassword: string;
};

export type GoogleLoginRequest = {
  idToken: string;
};

export type AuthLoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  role: "CUSTOMER" | "ARTISAN" | "ADMIN";
  expiresIn: number;
};

export const authLogin = async (data: LoginRequest): Promise<AuthLoginResponse> => {
  const response = await api.post<ApiResponse<AuthLoginResponse>>(
    "/api/auth/login",
    data
  );
  return response.data.data;
};

export const authGoogleLogin = async (
  data: GoogleLoginRequest
): Promise<AuthLoginResponse> => {
  const response = await api.post<ApiResponse<AuthLoginResponse>>(
    "/api/auth/google",
    data
  );
  return response.data.data;
};

export const authLogout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

export const authRegister = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post<ApiResponse<User>>("/api/users", data);
  return response.data.data;
};

export const authForgotPassword = async (
  data: ForgotPasswordRequest
): Promise<void> => {
  await api.post("/api/auth/forgot-password", data);
};

export const authVerifyOtp = async (data: VerifyOtpRequest): Promise<void> => {
  await api.post("/api/auth/verify-otp", data);
};

export const authResetPassword = async (
  data: ResetPasswordRequest
): Promise<void> => {
  await api.post("/api/auth/reset-password", data);
};
