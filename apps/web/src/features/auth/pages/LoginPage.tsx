// src/features/auth/pages/LoginPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";

import { toast } from "@/components/toast/toast.store";
import { validateLoginForm } from "@/features/auth/utils/validateLoginForm";

const REMEMBERED_EMAIL_KEY = "nextrep_remembered_email";

function getRememberedEmail() {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "";
}

// ---- Types (keep local or move to /types if you prefer) ----
export type LoginForm = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

type AuthLocationState = {
  from?: Location;
};

function getFromPath(state: unknown) {
  const s = state as AuthLocationState | null;
  const from = s?.from;
  if (!from) return "/dashboard";
  return from.pathname + from.search + from.hash;
}

export default function LoginPage() {
  const { state, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = useMemo(() => getFromPath(location.state), [location.state]);

  const [form, setForm] = useState<LoginForm>(() => ({
    email: getRememberedEmail(),
    password: "",
  }));

  const [touched, setTouched] = useState<Partial<Record<keyof LoginForm, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [remember, setRemember] = useState(() => Boolean(getRememberedEmail()));

  const [serverErrors, setServerErrors] = useState<LoginErrors>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  // ✅ client errors are derived from form
  const clientErrors = useMemo(() => validateLoginForm(form), [form]);
  const isValid = Object.keys(clientErrors).length === 0;

  function setField<K extends keyof LoginForm>(key: K, value: LoginForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));

    // clear server field error when user edits that field
    setServerErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function markTouched<K extends keyof LoginForm>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function showError<K extends keyof LoginForm>(key: K) {
    // server error wins (source of truth)
    if (serverErrors[key]) return serverErrors[key] ?? null;

    // only show client validation after touch
    if (touched[key] && clientErrors[key]) return clientErrors[key] ?? null;

    return null;
  }

  // Redirect AFTER render if already authed
  useEffect(() => {
    if (state.status === "authed") {
      navigate(fromPath, { replace: true });
    }
  }, [state.status, fromPath, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setTouched({ email: true, password: true });
    setServerErrors({});
    setServerMessage(null);

    if (!isValid) return;

    setSubmitting(true);
    try {
      const res = await login(form.email, form.password, remember);

      if (!res.ok) {
        if (res.fieldErrors) setServerErrors(res.fieldErrors);
        setServerMessage(res.message);

        // Optional: toast on form submit failure
        toast.error("Login failed", res.message);
        return;
      }

      if (remember) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, form.email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      toast.success("Welcome back");
      navigate(fromPath, { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  if (state.status === "booting") {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </div>
    );
  }
  if (state.status === "authed") return null;

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <img src="/nextrep-logo.png" alt="NextRep" className="h-auto w-56 max-w-full" />
        </div>

        <Card className="p-6">
          <form onSubmit={onSubmit} className="grid gap-5">
            <h1 className="text-center text-2xl font-semibold">Login</h1>

            {serverMessage ? (
              <div className="text-sm font-semibold text-destructive">{serverMessage}</div>
            ) : null}

            <div className="grid gap-4">
              <TextInput
                id="email"
                name="email"
                label="Email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => markTouched("email")}
                autoComplete="email"
                error={showError("email")}
                style={{ width: "100%", padding: "10px 12px" }}
              />

              <TextInput
                id="password"
                name="password"
                label="Password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                onBlur={() => markTouched("password")}
                type="password"
                autoComplete="current-password"
                error={showError("password")}
                style={{ width: "100%", padding: "10px 12px" }}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Remember me
            </label>

            <Button type="submit" className="w-full" disabled={!isValid || submitting}>
              {submitting ? "Logging in…" : "Login"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
