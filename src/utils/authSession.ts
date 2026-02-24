import type { AuthLoginResponse } from "../services/authApi";

export const persistAuthSession = (response: AuthLoginResponse) => {
  localStorage.setItem("accessToken", response.accessToken);
  localStorage.setItem("refreshToken", response.refreshToken);
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("userAccount", response.email);
  localStorage.setItem(
    "userInfo",
    JSON.stringify({
      id: response.userId,
      email: response.email,
      fullName: response.username || response.email,
      phone: "",
      avatarUrl: "",
      role: response.role || "CUSTOMER",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    })
  );
};
