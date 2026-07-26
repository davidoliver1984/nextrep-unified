// src/routes/journals.routes.tsx
import { Route } from "react-router-dom";
import { lazyDefault } from "./lazy";

const JournalsLayout = lazyDefault(() =>
  import("@/features/journals/pages/JournalsLayout")
);
const JournalsListPage = lazyDefault(() =>
  import("@/features/journals/pages/JournalsListPage")
);
const JournalCreatePage = lazyDefault(() =>
  import("@/features/journals/pages/JournalCreatePage")
);
const JournalViewPage = lazyDefault(() =>
  import("@/features/journals/pages/JournalViewPage")
);
const JournalEditPage = lazyDefault(() =>
  import("@/features/journals/pages/JournalCreatePage")
);

export function JournalsRoutes() {
  return (
    <Route path="/journals" element={<JournalsLayout />}>
      <Route index element={<JournalsListPage />} />
      <Route path="create" element={<JournalCreatePage />} />
      <Route path=":id" element={<JournalViewPage />} />
      <Route path=":id/edit" element={<JournalEditPage />} />
    </Route>
  );
}
