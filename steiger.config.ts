import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: ["**/*.test.ts", "**/*.test.tsx"],
  },
  {
    files: [
      "./src/app/**/page.tsx",
      "./src/app/**/route.ts",
      "./src/app/**/actions.ts",
      "./src/app/**/comment-actions.ts",
    ],
    rules: {
      "fsd/no-public-api-sidestep": "off",
    },
  },
  {
    files: ["./src/shared/**"],
    rules: {
      "fsd/public-api": "off",
    },
  },
]);