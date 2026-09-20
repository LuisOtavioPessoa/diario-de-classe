import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["backend/src/tests/setup.ts"],
  },
});