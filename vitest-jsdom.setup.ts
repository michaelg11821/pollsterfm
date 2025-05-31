import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

import { TextEncoder } from "util";

afterEach(() => {
  cleanup();

  vi.restoreAllMocks();
});

afterAll(() => {
  vi.unstubAllGlobals();
});

globalThis.URL.createObjectURL = vi.fn(() => "blob:fake-url");
globalThis.URL.revokeObjectURL = vi.fn();

if (typeof File !== "undefined") {
  Object.defineProperty(File.prototype, "arrayBuffer", {
    configurable: true,
    writable: true,
    value: async function (): Promise<ArrayBuffer> {
      const encoder = new TextEncoder();

      return encoder.encode(this.name).buffer as ArrayBuffer;
    },
  });
}
