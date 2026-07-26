// src/components/ui/PageFallback.tsx
import { Card } from "@/components/ui/Card";
import { SkeletonStack } from "@/components/ui/SkeletonStack";

export function PageFallback({ title = "Loading…" }: { title?: string }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      <Card>
        <div style={{ display: "grid", gap: 10 }}>
          <SkeletonStack rows={4} />
        </div>
      </Card>
    </div>
  );
}