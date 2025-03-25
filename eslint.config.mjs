import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-console": "off",
      "no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "import/no-anonymous-default-export": "off",
      "no-undef": "off",
      "no-restricted-globals": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "no-throw-literal": "error"
    }
  }
];

export default eslintConfig;