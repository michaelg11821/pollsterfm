import {
  isPollExpired,
  resolveListeningHistoryImportStatus,
} from "@/lib/convex/user";
import { describe, expect, test } from "vitest";

describe("resolveListeningHistoryImportStatus", () => {
  test("returns not_imported when no import exists", () => {
    expect(resolveListeningHistoryImportStatus(undefined)).toBe("not_imported");
  });

  test("maps succeeded to imported", () => {
    expect(resolveListeningHistoryImportStatus("succeeded")).toBe("imported");
  });

  test("passes through in-progress statuses", () => {
    expect(resolveListeningHistoryImportStatus("queued")).toBe("queued");
    expect(resolveListeningHistoryImportStatus("processing")).toBe("processing");
    expect(resolveListeningHistoryImportStatus("failed")).toBe("failed");
  });
});

describe("isPollExpired", () => {
  test("returns true when expiry is in the past", () => {
    expect(isPollExpired(100, 101)).toBe(true);
  });

  test("returns true when expiry equals now", () => {
    expect(isPollExpired(100, 100)).toBe(true);
  });

  test("returns false when expiry is in the future", () => {
    expect(isPollExpired(100, 99)).toBe(false);
  });
});
