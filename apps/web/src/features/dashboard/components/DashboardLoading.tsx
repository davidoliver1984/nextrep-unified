import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export function DashboardLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading dashboard">
      {[0, 1, 2].map((item) => (
        <Card key={item} className={item === 0 ? "md:col-span-2 xl:col-span-1" : ""}>
          <CardHeader>
            <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-16 animate-pulse rounded-lg bg-muted" />
            <div className="h-16 animate-pulse rounded-lg bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
