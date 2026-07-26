// src/components/ui/ImageUpload.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { isValidImageFile } from "@/utils/files";
import { Button } from "@/components/ui/Button";

type Props = {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string | null;
  maxBytes?: number;
  allowedExts?: string[];
};

export function ImageUpload({
  label,
  value,
  onChange,
  error,
  maxBytes = 5 * 1024 * 1024,
  allowedExts = ["jpg", "jpeg", "png", "webp"],
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!value) return null;
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function pick() {
    inputRef.current?.click();
  }

  function clear() {
    setLocalError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    setLocalError(null);

    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) {
      onChange(null);
      return;
    }

    const valid = isValidImageFile(file, { maxBytes, allowedExts });
    if (!valid.ok) {
      setLocalError(valid.message);
      onChange(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onChange(file);
  }

  const shownError = localError ?? error ?? null;

  return (
    <div className="grid gap-3">
      <div className="font-semibold">{label}</div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={pick}>
          {value ? "Change image" : "Choose image"}
        </Button>

        {value ? (
          <Button type="button" variant="ghost" onClick={clear}>
            Remove
          </Button>
        ) : null}

        <div className="text-sm text-muted-foreground">
          {value ? `${value.name} (${Math.round(value.size / 1024)} KB)` : "No file selected"}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: "none" }}
      />

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-60 max-w-full rounded-xl border object-contain"
        />
      ) : null}

      {shownError ? <div className="text-sm font-semibold text-destructive">{shownError}</div> : null}
    </div>
  );
}
