import { useCallback, useMemo, useState } from "react";

type FieldErrors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;
type Options<T> = { initial: T };

export function useFormState<T extends object>({ initial }: Options<T>) {
  const [form, setForm] = useState<T>(initial);

  const [serverErrors, setServerErrors] = useState<FieldErrors<T>>({});
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<Touched<T>>({});

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setServerErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const markTouched = useCallback(<K extends keyof T>(key: K) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const showError = useCallback(
    <K extends keyof T>(key: K): string | null => {
      if (serverErrors[key]) return serverErrors[key] ?? null;
      return touched[key] && errors[key] ? errors[key]! : null;
    },
    [serverErrors, touched, errors]
  );

  const reset = useCallback((next: T) => {
    setForm(next);
    setTouched({});
    setErrors({});
    setServerErrors({});
  }, []);

  return useMemo(
    () => ({
      form,
      setForm,

      setField,
      touched,
      setTouched,
      markTouched,

      errors,
      setErrors,

      serverErrors,
      setServerErrors,

      showError,
      reset,
    }),
    [form, setField, touched, markTouched, errors, serverErrors, showError, reset]
  );
}
