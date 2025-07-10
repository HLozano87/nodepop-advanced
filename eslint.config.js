import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "semi": ["warn", "always"],
      "no-unused-vars": [
        "error",
        { 
          argsIgnorePattern: "^next$"
        },
      ],
    },
  },
  {
    files: ["public/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        io: "readonly",
        Toastify: "readonly",
      },
    },
  },
  {
    ignores: ["views/**"],
  },
]);