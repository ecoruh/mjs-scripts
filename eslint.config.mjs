// my-utility-scripts/eslint.config.js
import globals from "globals";
import js from "@eslint/js"; // Recommended base rules from ESLint

export default [
  // Apply recommended rules globally
  js.configs.recommended,

  // Configuration for your script files within workspaces
  {
    files: ["scripts/**/*.mjs"], // Target .mjs files within any subdir of scripts/
    languageOptions: {
      ecmaVersion: "latest", // Use modern ECMAScript features
      sourceType: "module", // Use ES modules (import/export)
      globals: {
        ...globals.node, // Add Node.js global variables
      },
    },
    // Add your specific rules here
    rules: {
      "no-unused-vars": "warn", // Example: Warn about unused variables
      "semi": ["error", "always"], // Example: Require semicolons
      // Add more rules based on your preferences or style guide
    },
  },

  // Optional: Configuration specific to config files themselves
  // {
  //   files: ["eslint.config.js"],
  //   languageOptions: {
  //     globals: {
  //       ...globals.node,
  //     },
  //   },
  // },

  // Optional: Ignore specific files or directories
  {
    ignores: [
      "node_modules/", // Always ignore node_modules
      "**/dist/",       // Example: ignore build output directories
    ],
  },
];