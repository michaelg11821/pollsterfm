import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      {
        plugins: [react()],
        test: {
          include: ["src/app/components/**/*.test.tsx"],
          name: "jsdom",
          environment: "jsdom",
          setupFiles: ["./vitest-jsdom.setup.ts"],
          globals: true,
          clearMocks: true,
        },
        resolve: {
          alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
        },
      },
      {
        test: {
          include: ["src/lib/__tests__/**/*.test.ts"],
          name: "node",
          environment: "node",
          setupFiles: ["./vitest-node.setup.ts"],
          globals: true,
          clearMocks: true,
        },
        resolve: {
          alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
        },
      },
    ],
  },
});
