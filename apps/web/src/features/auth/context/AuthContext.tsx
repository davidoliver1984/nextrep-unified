import axios from "axios";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "@/features/auth/api/auth.api";

const TOKEN_KEY = "nextrep_token";

type User = { id: number; name: string; email: string };

type AuthState =
  | { status: "booting"; user: null }
  | { status: "unauth"; user: null }
  | { status: "authed"; user: User };

type AuthContextValue = {
  state: AuthState;
  token: string | null;
  login: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<{ ok: true } | { ok: false; message: string; fieldErrors?: Partial<Record<"email" | "password", string>> }>;
  logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
  );
  const [state, setState] = useState<AuthState>(() =>
    token ? { status: "booting", user: null } : { status: "unauth", user: null }
  );

  // ✅ bootstrap: if token exists, fetch current user via /api/user
  useEffect(() => {
    let alive = true;

    async function boot() {
      if (!token) {
        if (alive) setState({ status: "unauth", user: null });
        return;
      }

      if (alive) setState({ status: "booting", user: null });

      try {
        const user = await authApi.user(); // ✅ /api/user
        if (alive) setState({ status: "authed", user });
      } catch {
        // token invalid OR endpoint mismatch OR auth header missing
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        if (alive) {
          setToken(null);
          setState({ status: "unauth", user: null });
        }
      }
    }

    void boot();
    return () => {
      alive = false;
    };
  }, [token]);

  const login = useCallback(async (email: string, password: string, remember = false) => {
    try {
      const res = await authApi.login({ email, password });

      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setState({ status: "authed", user: res.user });

      return { ok: true as const };
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 422) {
        const data = e.response.data as {
          message?: string;
          errors?: { email?: unknown; password?: unknown };
        };
        const fieldErrors = data?.errors
          ? {
              email: Array.isArray(data.errors.email) ? data.errors.email[0] : undefined,
              password: Array.isArray(data.errors.password) ? data.errors.password[0] : undefined,
            }
          : undefined;

        return {
          ok: false as const,
          message: data?.message ?? "Validation failed",
          fieldErrors,
        };
      }

      const message = e instanceof Error ? e.message : "Login failed";
      return { ok: false as const, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setState({ status: "unauth", user: null });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ state, token, login, logout }), [state, token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
