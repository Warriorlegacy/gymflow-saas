import { describe, it, expect } from "vitest";
import { cn, currency, toTitleCase } from "@gymflow/lib";

describe("cn utility", () => {
  it("should combine class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should filter out falsy values", () => {
    expect(cn("foo", null, "bar", undefined, false)).toBe("foo bar");
  });

  it("should handle empty input", () => {
    expect(cn()).toBe("");
  });
});

describe("currency utility", () => {
  it("should format INR currency by default", () => {
    const result = currency(1000);
    expect(result).toContain("1,000");
  });

  it("should handle zero", () => {
    const result = currency(0);
    expect(result).toContain("0");
  });

  it("should handle decimal values", () => {
    const result = currency(999.99);
    expect(result).toContain("1,000");
  });
});

describe("toTitleCase utility", () => {
  it("should convert snake_case to Title Case", () => {
    expect(toTitleCase("gym_name")).toBe("Gym Name");
  });

  it("should handle single word", () => {
    expect(toTitleCase("name")).toBe("Name");
  });

  it("should handle multiple spaces", () => {
    expect(toTitleCase("owner  name")).toBe("Owner Name");
  });
});
