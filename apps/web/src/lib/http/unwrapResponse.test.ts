import { describe, expect, it } from "vitest";
import { unwrapList, unwrapOne } from "./unwrapResponse";

describe("Laravel response helpers", () => {
  it("unwraps plain and resource-wrapped records", () => {
    expect(unwrapOne<{ id: number }>({ data: { id: 5 } })).toEqual({ id: 5 });
    expect(unwrapOne<{ id: number }>({ data: { data: { id: 6 } } })).toEqual({ id: 6 });
  });

  it("unwraps plain, resource and nested lists", () => {
    expect(unwrapList<number>([1, 2])).toEqual([1, 2]);
    expect(unwrapList<number>({ data: [3, 4] })).toEqual([3, 4]);
    expect(unwrapList<number>({ data: { data: [5, 6] } })).toEqual([5, 6]);
  });

  it("rejects an unexpected list response", () => {
    expect(() => unwrapList({ message: "not a list" })).toThrow(
      "Unexpected response format"
    );
  });
});
