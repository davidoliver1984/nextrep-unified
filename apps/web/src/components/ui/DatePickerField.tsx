import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  label: string;
  value: string; // "YYYY-MM-DD" or ""
  onChange: (next: string) => void;
  onBlur?: () => void;
  error?: string | null;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
};

function toDate(value: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value + "T00:00:00");
  return Number.isFinite(d.getTime()) ? d : undefined;
}

function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  placeholder = "Pick a date",
}: Props) {
  const fieldId =
    id ?? label.toLowerCase().replace(/\s+/g, "-");

  const selected = React.useMemo(() => toDate(value), [value]);

  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>{label}</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={fieldId}
            type="button"
            variant="outline"
            disabled={disabled}
            onBlur={onBlur}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, "yyyy-MM-dd") : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (!d) return;
              onChange(toYmd(d));
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
