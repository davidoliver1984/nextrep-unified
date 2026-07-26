import { useId, type InputHTMLAttributes } from "react";
import { Field } from "./Field";
import { cn } from "@/lib/utils";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
};

export function TextInput({ label, error, className, id, ...props }: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Field label={label} htmlFor={inputId} error={error}>
      <input
        {...props}
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none transition-[color,box-shadow]",
          "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive/30",
          className
        )}
      />
    </Field>
  );
}
