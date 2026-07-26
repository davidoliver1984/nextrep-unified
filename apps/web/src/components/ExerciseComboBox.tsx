import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, FocusEvent } from "react";
import type { Exercise } from "@/features/exercises/types/exercise";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type Props = {
  label?: string;
  exercises: Exercise[];
  value: number | null;
  onChange: (nextId: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  maxResults?: number;
  minSearchLength?: number;
  error?: string | null;
  onBlur?: () => void;
};

function getLabel(ex: Exercise) {
  const name = ex.exercise_name ?? "";
  const eq = ex.equipment_type ? ` (${ex.equipment_type})` : "";
  return `${name}${eq}`.trim();
}

export const ExerciseCombobox = memo(function ExerciseCombobox({
  label,
  exercises,
  value,
  onChange,
  disabled = false,
  placeholder = "Search exercises…",
  maxResults = 10,
  minSearchLength = 2,
  error = null,
  onBlur: onFieldBlur,
}: Props) {
  const inputId = useId();
  const listboxId = useId();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  // Precompute labels once per exercises array
  const index = useMemo(() => {
    return exercises.map((ex) => {
      const label = getLabel(ex);
      return { ex, label, haystack: label.toLowerCase() };
    });
  }, [exercises]);

  const selected = useMemo(() => {
    if (value == null) return null;
    return exercises.find((exercise) => Number(exercise.id) === value) ?? null;
  }, [exercises, value]);

  const selectedLabel = selected ? getLabel(selected) : "";

  const filtered = useMemo(() => {
    if (!open) return [];
    const q = search.trim().toLowerCase();
    if (q.length < minSearchLength) return [];

    const out: Exercise[] = [];
    for (const item of index) {
      if (item.haystack.includes(q)) out.push(item.ex);
      if (out.length >= maxResults) break;
    }
    return out;
  }, [open, search, index, maxResults, minSearchLength]);

  const activeIndex = Math.min(highlighted, Math.max(filtered.length - 1, 0));

  // Keep active option visible while arrowing
  useEffect(() => {
    if (!open) return;
    const active = filtered[activeIndex];
    if (!active) return;

    const el = document.getElementById(`${listboxId}-opt-${active.id}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, filtered, listboxId]);

  // Click outside closes
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function pick(ex: Exercise) {
    onChange(Number(ex.id));
    setSearch("");
    setOpen(false);
    setEditing(false);
  }

  function clear() {
    onChange(null);
    setSearch("");
    setOpen(false);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      if (search.trim().length < minSearchLength) return;
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!filtered.length) return;
      setHighlighted((h) => (h + 1) % filtered.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!filtered.length) return;
      setHighlighted((h) => (h - 1 + filtered.length) % filtered.length);
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      setHighlighted(0);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      if (!filtered.length) return;
      setHighlighted(filtered.length - 1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const ex = filtered[activeIndex];
      if (ex) pick(ex);
      return;
    }
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    // Close only if focus moved outside the root
    const next = e.relatedTarget as Node | null;
    if (next && rootRef.current?.contains(next)) return;
    setOpen(false);
    setEditing(false);
    setSearch("");
    onFieldBlur?.();
  }

  const activeId =
    open && filtered[activeIndex]
      ? `${listboxId}-opt-${filtered[activeIndex].id}`
      : undefined;

  return (
    <div ref={rootRef} className="relative grid gap-2">
      {label ? <div className="font-semibold">{label}</div> : null}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          id={inputId}
          ref={inputRef}
          disabled={disabled}
          value={editing ? search : selectedLabel}
          placeholder={placeholder}
          onFocus={(event) => {
            const input = event.currentTarget;
            setEditing(true);
            setSearch(selectedLabel);
            requestAnimationFrame(() => {
              const end = input.value.length;
              input.setSelectionRange(end, end);
            });
          }}
          onBlur={handleBlur}
          onChange={(e) => {
            const nextSearch = e.target.value;
            setSearch(nextSearch);
            setOpen(nextSearch.trim().length >= minSearchLength);
            setHighlighted(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeId}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none",
            "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
            error && "border-destructive focus-visible:ring-destructive/30"
          )}
        />

        {value != null && !disabled ? (
          <Button type="button" variant="ghost" size="sm" onClick={clear}>
            Clear
          </Button>
        ) : null}
      </div>

      {open ? (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-auto rounded-md border",
            "bg-popover text-popover-foreground shadow-md"
          )}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: 10, opacity: 0.75 }}>No matches</div>
          ) : (
            filtered.map((ex, idx) => {
              const isActive = idx === highlighted;
              return (
                <div
                  key={ex.id}
                  id={`${listboxId}-opt-${ex.id}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(ex);
                  }}
                  onMouseEnter={() => setHighlighted(idx)}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer",
                    isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                  )}
                >
                  {getLabel(ex)}
                </div>
              );
            })
          )}
        </div>
      ) : null}

      {error ? <div className="text-sm font-semibold text-destructive">{error}</div> : null}
    </div>
  );
});
