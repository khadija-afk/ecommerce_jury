// eslint.config.js
import js from "@eslint/js";
export default [
    js.configs.recommended,
    // js.configs.all,
    {
      files: ["**/*.js"],
      rules: {
        // "prefer-const": "error",
      },
    },
  ];
  