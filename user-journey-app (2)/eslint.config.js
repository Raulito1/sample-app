import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettier from "eslint-plugin-prettier";

export default [
  // JS recommended base
  js.configs.recommended,

  // TypeScript recommended base
  ...tseslint.configs.recommended,

  // React recommended base
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
      prettier,
    },
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      //-----------------------
      // React & Hooks
      //-----------------------
      "react/jsx-uses-react": "off", // Required for new JSX runtime
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      //-----------------------
      // Import quality
      //-----------------------
      "import/no-unresolved": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      //-----------------------
      // Prettier integration
      //-----------------------
      "prettier/prettier": "error",
    },
  },

  // Ignore build output
  {
    ignores: ["dist", "node_modules"],
  },
];
