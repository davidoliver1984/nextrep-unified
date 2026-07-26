// src/routes/workouts.routes.tsx
import { Route } from "react-router-dom";
import { lazyDefault } from "./lazy";

const WorkoutCreatePage = lazyDefault(() =>
  import("@/features/workouts/pages/WorkoutCreatePage")
);

const WorkoutDetailPage = lazyDefault(() =>
  import("@/features/workouts/pages/WorkoutDetailPage")
);

const WorkoutsPage = lazyDefault(() =>
  import("@/features/workouts/pages/WorkoutsPage")
);

export function WorkoutsRoutes() {
  return (
    <>
      <Route path="/workouts" element={<WorkoutsPage />} />
      <Route path="/workouts/create" element={<WorkoutCreatePage />} />
      <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
    </>
  );
}
