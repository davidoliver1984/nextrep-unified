import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextInput } from "./TextInput";

describe("TextInput", () => {
  it("associates its label with the input", () => {
    render(<TextInput label="Email" name="email" />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
  });

  it("marks invalid fields for assistive technology", () => {
    render(<TextInput label="Email" error="Email is required" />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Email is required")).toBeVisible();
  });
});
