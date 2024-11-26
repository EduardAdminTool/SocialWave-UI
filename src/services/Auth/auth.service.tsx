import api from "@/api/api";
import { ConfirmEmailDto } from "@/dtos/auth/confirm-email.dto";
import { RegisterDataDto } from "@/dtos/auth/register-data.dto";
import { ResetPasswordDto } from "@/dtos/auth/reset-password.dto";

export const register = async (data: RegisterDataDto) => {
  return await api.post("/auth/register", data, {});
};

export const login = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data, {});
};

export const resendVerificationEmail = async (email: string) => {
  return await api.post("/auth/resend-confirmation", { email });
};

export const confirmEmail = async (payload: ConfirmEmailDto) => {
  return await api.post("/auth/confirm-email", payload, {});
};

export const forgotPassword = async (email: string) => {
  return await api.post("/auth/forgot-password", { email }, {});
};

export const resetPassword = async (data: ResetPasswordDto) => {
  return await api.post("/auth/reset-password", data, {});
};
