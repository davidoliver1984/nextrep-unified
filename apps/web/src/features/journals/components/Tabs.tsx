// Tabs.tsx
import { Button } from "@/components/ui/Button";

export type TabItem<K extends string> = {
  key: K;
  label: string;
  count?: number;
};

export type TabsProps<K extends string> = {
  value: K;
  items: readonly TabItem<K>[];
  onChange: (next: K) => void;
};

export function Tabs<K extends string>({ value, items, onChange }: TabsProps<K>) {
  return (
    <div className="flex items-center gap-2">
      {items.map((t) => (
        <Button
          key={t.key}
          type="button"
          variant={t.key === value ? "secondary" : "ghost"}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          {typeof t.count === "number" ? ` (${t.count})` : ""}
        </Button>
      ))}
    </div>
  );
}
