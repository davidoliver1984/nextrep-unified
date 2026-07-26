import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string | null;
  children: ReactNode;
};

export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <label htmlFor={htmlFor} style={{ fontSize: 12, opacity: 0.75 }}>
        {label}
      </label>
      {children}

      {error ? (
        <div style={{ fontSize: 12, color: "#cc0000", fontWeight: 600 }}>{error}</div>
      ) : null}
    </div>
  );
}
