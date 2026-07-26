import { describe, expect, it } from "vitest";
import { toCreateWorkoutPayload } from "./toCreateWorkoutPayload";

describe("toCreateWorkoutPayload", () => {
  it("maps form strings to the API contract", () => {
    expect(
      toCreateWorkoutPayload(
        {
          title: "  Pull day  ",
          date: "2026-07-20",
          journalId: "42",
          entries: [{ exerciseId: "7", sets: "3", reps: "8", weight: "60.5" }],
        },
        42
      )
    ).toEqual({
      journal_id: 42,
      title: "Pull day",
      date: "2026-07-20",
      entries: [{ exercise_id: 7, sets: 3, reps: 8, weight: 60.5 }],
    });
  });

  it("uses null for optional API fields", () => {
    expect(
      toCreateWorkoutPayload({ title: "Core", date: "", journalId: "", entries: [] })
    ).toMatchObject({ journal_id: null, date: null });
  });
});
