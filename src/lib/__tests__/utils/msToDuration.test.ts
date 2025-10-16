import { msToDuration } from "@/lib/convex-utils";

describe("one digit", () => {
  it("returns minute duration", () => {
    const result = msToDuration(65_000);

    expect(result).toEqual("1:05");
  });

  it("returns hour duration", () => {
    const result = msToDuration(3_809_000);

    expect(result).toEqual("1:03:29");
  });
});

describe("two digit", () => {
  it("returns minute duration", () => {
    const result = msToDuration(642_000);

    expect(result).toEqual("10:42");
  });

  it("returns hour duration", () => {
    const result = msToDuration(36_209_000);

    expect(result).toEqual("10:03:29");
  });
});

describe("oddities", () => {
  it("returns 0:00 for 0 ms", () => {
    const result = msToDuration(0);

    expect(result).toEqual("0:00");
  });
});
