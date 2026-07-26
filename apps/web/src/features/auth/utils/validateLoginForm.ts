
// src/features/auth/utils/validateLoginForm.ts
import type { LoginForm } from "@/features/auth/types/loginForm";

export type LoginErrors = Partial<Record<keyof LoginForm, string>>;

function isEmailLike(value: string) {
  // not perfect, but solid client-side check (server is the source of truth)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateLoginForm(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};

  const email = form.email.trim();
  const password = form.password;

  if (!email) errors.email = "Email is required";
  else if (!isEmailLike(email)) errors.email = "Enter a valid email address";

  if (!password) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";

  return errors;
}