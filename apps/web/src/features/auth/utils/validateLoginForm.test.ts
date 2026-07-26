import { describe, expect, it } from "vitest";
import { validateLoginForm } from "./validateLoginForm";

describe("validateLoginForm", () => {
  it("accepts a valid email and password", () => {
    expect(
      validateLoginForm({ email: "user@example.com", password: "secret12" })
    ).toEqual({});
  });

  it("reports useful errors for invalid credentials", () => {
    expect(validateLoginForm({ email: "not-an-email", password: "123" })).toEqual({
      email: "Enter a valid email address",
      password: "Password must be at least 6 characters",
    });
  });
});
