import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { JournalImageGrid } from "./JournalImageGrid";
import type { JournalImage } from "@/features/journals/types";

const image: JournalImage = {
  id: 10,
  journal_id: 20,
  journal_date: "2026-07-21",
  url: "https://example.test/original.jpg",
  thumbnail_url: "https://example.test/thumbnail.jpg",
  path: "journals/20/original.jpg",
};

describe("JournalImageGrid", () => {
  it("loads the thumbnail and links gallery images to the internal viewer", () => {
    render(
      <MemoryRouter>
        <JournalImageGrid
          images={[image]}
          onDelete={() => undefined}
          viewerPath={(item) => `/gallery/images/${item.id}`}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("img", { name: "Journal progress" })).toHaveAttribute(
      "src",
      image.thumbnail_url
    );
    expect(screen.getByRole("link", { name: "View original image" })).toHaveAttribute(
      "href",
      "/gallery/images/10"
    );
  });
});
