import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { FastestMovingPanel } from "@/features/dashboard/components/FastestMovingPanel";
import { ProgressionPanel } from "@/features/dashboard/components/ProgressionPanel";
import { TodaysWorkoutsPanel } from "@/features/dashboard/components/TodaysWorkoutsPanel";

describe("dashboard panels", () => {
  it("links an empty day to journal creation", () => {
    render(
      <MemoryRouter>
        <TodaysWorkoutsPanel workouts={[]} />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Create workout" })).toHaveAttribute(
      "href",
      "/journals/create"
    );
  });

  it("renders today's workout with its exercise count", () => {
    render(
      <MemoryRouter>
        <TodaysWorkoutsPanel
          workouts={[
            {
              id: 12,
              user_id: 1,
              journal_id: 7,
              title: "Heavy back day",
              date: "2026-07-20",
              entries: [],
            },
          ]}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Heavy back day/ })).toHaveAttribute(
      "href",
      "/journals/7/edit?tab=saved"
    );
    expect(screen.getByText("0 exercises")).toBeInTheDocument();
  });

  it("renders progression and fastest-moving report values", () => {
    render(
      <>
        <ProgressionPanel
          lifts={[
            {
              exercise_id: 4,
              exercise_name: "Bench Press",
              current_weight: 110,
              personal_best_weight: 110,
              last_progressed_at: "2026-06-20",
              last_performed_at: "2026-07-10",
              days_since_progression: 30,
              performance_count: 3,
            },
          ]}
        />
        <FastestMovingPanel
          lifts={[
            {
              exercise_id: 8,
              exercise_name: "Barbell Row",
              starting_weight: 50,
              current_weight: 75,
              increase_percentage: 50,
              started_at: "2026-04-25",
              last_performed_at: "2026-07-10",
              performance_count: 2,
            },
          ]}
        />
      </>
    );

    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("30 days")).toBeInTheDocument();
    expect(screen.getByText("Barbell Row")).toBeInTheDocument();
    expect(screen.getByText("+50%")).toBeInTheDocument();
  });
});
