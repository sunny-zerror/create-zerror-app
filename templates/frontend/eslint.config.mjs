import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Plain JavaScript has no type checker: catch undefined and unused names here
  {
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["warn", { ignoreRestSiblings: true, argsIgnorePattern: "^_" }],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**"]),
]);

export default eslintConfig;
