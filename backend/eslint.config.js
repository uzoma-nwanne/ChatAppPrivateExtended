import {defineConfig} from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  {files: ["**/*.{js,mjs,cjs}"]},
  {files: ["**/tests/*.{js,mjs,cjs}"], languageOptions: {globals: globals.jest}},
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {globals: globals.node},
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {js},
    extends: ["js/recommended"],
  },
]);
