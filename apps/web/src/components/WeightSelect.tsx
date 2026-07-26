// src/components/WeightSelect.tsx
import { useMemo } from "react";

type Props = {
  label?: string;
  value: number;
  onChange: (next: number) => void;
  onBlur?: () => void;
  error?: string | null;
  minWhole?: number;
  maxWhole?: number;
  disabled?: boolean;
};

function toTenths(n: number) {
  return Math.round(n * 10);
}
function fromTenths(t: number) {
  return t / 10;
}
function split(value: number) {
  const t = toTenths(Number.isFinite(value) ? value : 0);
  const whole = Math.trunc(t / 10);
  const tenth = Math.abs(t % 10);
  return { whole, tenth };
}
function combine(whole: number, tenth: number) {
  const sign = whole < 0 ? -1 : 1;
  const t = Math.abs(whole) * 10 + (Math.abs(tenth) % 10);
  return fromTenths(sign * t);
}

export function WeightSelect({
  label,
  value,
  onChange,
  onBlur,
  error,
  minWhole = 0,
  maxWhole = 300,
  disabled = false,
}: Props) {
  const { whole, tenth } = split(value);

  const wholeOptions = useMemo(() => {
    const out: number[] = [];
    for (let i = minWhole; i <= maxWhole; i++) out.push(i);
    return out;
  }, [minWhole, maxWhole]);

  function emit(nextWholeRaw: string, nextTenthRaw: string) {
    const w = Number(nextWholeRaw);
    const d = Number(nextTenthRaw);
    if (!Number.isFinite(w) || !Number.isFinite(d)) return;
    onChange(combine(Math.trunc(w), Math.trunc(d)));
  }

  const selectCls =
    "h-9 rounded-md border bg-background px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";

  return (
    <div className="grid gap-1">
      {label ? (
        <div className="text-xs text-muted-foreground">{label}</div>
      ) : null}
      <div className="flex items-center gap-2">
        <select
          className={`${selectCls} w-[84px] text-[11px]`}
          disabled={disabled}
          value={String(whole)}
          onChange={(e) => {
            const next = e.target.value;
            emit(next, String(tenth));
          }}
          onBlur={onBlur}
        >
          {wholeOptions.map((n) => (
            <option key={n} value={String(n)}>
              {n}
            </option>
          ))}
        </select>

        <select
          className={`${selectCls} w-[72px] text-[11px]`}
          disabled={disabled}
          value={String(tenth)}
          onChange={(e) => {
            const next = e.target.value;
            emit(String(whole), next);
          }}
          onBlur={onBlur}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={String(i)}>
              .{i}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="text-xs text-destructive">{error}</div>
      ) : null}
    </div>
  );
}
