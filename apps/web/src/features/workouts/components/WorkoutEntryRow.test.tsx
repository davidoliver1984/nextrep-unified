import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WorkoutEntryRow } from "./WorkoutEntryRow";
import type { WorkoutEntry } from "@/features/workouts/types/workoutEntry";

const entry: WorkoutEntry = {
  id: 10,
  workout_id: 20,
  exercise_id: 30,
  exercise_name: "Chest Press",
  sets: 3,
  reps: 10,
  weight: 40,
  completed: false,
};

describe("WorkoutEntryRow", () => {
  it("marks an unfinished entry clearly and can complete it", async () => {
    const onPatch = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <WorkoutEntryRow
        entry={entry}
        exercises={[]}
        onPatch={onPatch}
        onRemove={vi.fn()}
      />
    );

    expect(screen.getByText("To do")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mark exercise complete" }));

    expect(onPatch).toHaveBeenCalledWith(entry.id, { completed: true });
  });

  it("offers to reverse a completed entry", () => {
    render(
      <WorkoutEntryRow
        entry={{ ...entry, completed: true }}
        exercises={[]}
        onPatch={vi.fn()}
        onRemove={vi.fn()}
      />
    );

    expect(screen.queryByText("To do")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mark exercise incomplete" })
    ).toBeInTheDocument();
  });
});
