import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

globalThis.URL.createObjectURL = vi.fn(() => "blob:fake-url");
globalThis.URL.revokeObjectURL = vi.fn();
