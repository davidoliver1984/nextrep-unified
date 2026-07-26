import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DatePickerField } from "@/components/ui/DatePickerField";

describe("DatePickerField", () => {
  it("opens the calendar popover", async () => {
    const user = userEvent.setup();

    render(
      <DatePickerField
        label="Date"
        value="2026-07-19"
        onChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "Date" }));

    expect(screen.getByRole("grid", { name: "July 2026" })).toBeInTheDocument();
  });

  it("allows a later date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePickerField
        label="Date"
        value="2026-07-19"
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Date" }));
    await user.click(screen.getByRole("button", { name: "Wednesday, July 22nd, 2026" }));

    expect(onChange).toHaveBeenCalledWith("2026-07-22");
  });
});
