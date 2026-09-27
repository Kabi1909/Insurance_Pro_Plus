export default [
  {
    files: ["**/*.jsx", "**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "no-undef": "error",
      "react/jsx-no-undef": "error"
    }
  }
];
