import { Skeleton } from "./Skeleton";

export function SkeletonStack({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={14} />
      ))}
    </div>
  );
}