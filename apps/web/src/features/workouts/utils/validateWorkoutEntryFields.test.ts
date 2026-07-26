import { describe, expect, it } from "vitest";
import { validateWorkoutEntryFields } from "./validateWorkoutEntryFields";

describe("validateWorkoutEntryFields", () => {
  it("accepts a complete workout entry", () => {
    expect(
      validateWorkoutEntryFields({
        exerciseId: "12",
        sets: "3",
        reps: "10",
        weight: "42.5",
      })
    ).toEqual({});
  });

  it("rejects missing, fractional and negative values", () => {
    expect(
      validateWorkoutEntryFields({
        exerciseId: "",
        sets: "2.5",
        reps: "0",
        weight: "-1",
      })
    ).toEqual({
      exerciseId: "Choose an exercise.",
      sets: "Must be a whole number.",
      reps: "Must be at least 1.",
      weight: "Must be 0 or more.",
    });
  });
});
