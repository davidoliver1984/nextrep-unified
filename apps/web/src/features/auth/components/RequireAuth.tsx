import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function RequireAuth() {
  const { state } = useAuth();
  const location = useLocation();

  if (state.status === "booting") return <p>Checking session…</p>;
  if (state.status === "unauth") return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}