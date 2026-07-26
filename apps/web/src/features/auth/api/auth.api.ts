import api from "@/api/api";
import axios from "axios";

export type LoginPayload = { email: string; password: string };
export type User = { id: number; name: string; email: string };

// type Login422 = {
//   message: string;
//   errors: Partial<Record<keyof LoginPayload, string[]>>;
// };

export const authApi = {
  async login(payload: LoginPayload): Promise<{ token: string; user: User }> {
    try {
      const res = await api.post("/login", payload);
      return res.data as { token: string; user: User };
    } catch (err) {
      // rethrow but keep 422 payload readable
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        throw err;
      }
      throw err instanceof Error ? err : new Error("Login failed");
    }
  },

  // THIS IS YOUR BACKEND ENDPOINT
  async user(): Promise<User> {
    const res = await api.get("/user");
    return res.data as User;
  },
};