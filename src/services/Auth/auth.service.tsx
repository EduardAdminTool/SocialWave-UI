import api from "@/api/api";
import { RegisterDataDto } from "@/dtos/auth/register-data.dto";

export const register = async (data: RegisterDataDto) => {
  return await api.post("/auth/register", data, {});
};
