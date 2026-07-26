// src/App.tsx
import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { PageFallback } from "@/components/ui/PageFallback";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/useTheme";

import { lazyDefault } from "@/routes/lazy";
import { JournalsRoutes } from "@/routes/journals.routes";
import { WorkoutsRoutes } from "@/routes/workouts.routes";

const LoginPage = lazyDefault(() => import("@/features/auth/pages/LoginPage"));
const DashboardPage = lazyDefault(() => import("@/features/dashboard/pages/DashboardPage"));
const GalleryPage = lazyDefault(() => import("@/features/journals/pages/GalleryPage"));
const GalleryImagePage = lazyDefault(() => import("@/features/journals/pages/GalleryImagePage"));

export default function App() {
  const { theme } = useTheme();

  return (
    <>
    <Suspense fallback={<PageFallback />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<RequireAuth />}>
          {WorkoutsRoutes()}
          {JournalsRoutes()}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/images/:imageId" element={<GalleryImagePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </Suspense>
    <Toaster richColors theme={theme} />
    </>
  );
}
