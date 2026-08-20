import api from "@/lib/api"

export const login = (data) => api.post("/auth/login", data)
export const register = (data) => api.post("/auth/register", data)
export const getCurrentUser = () => api.get("/auth/me")
export const forgotPassword = (data) => api.post("/auth/forgot-password", data)
export const verifyCode = (data) => api.post("/auth/verify-reset-code", data)
export const resetPassword = (data) => api.post("/auth/reset-password", data)
