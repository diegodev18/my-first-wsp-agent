
export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
      },
      globals: {
        // Node globals
        require: "readonly",
        module: "readonly",
        process: "readonly",
        console: "readonly",
      }
    },
    rules: {
      "no-restricted-globals": ["error", "name", "length"],
      "prefer-arrow-callback": "error",
      "quotes": ["error", "double", { "allowTemplateLiterals": true }],
      "object-curly-spacing": "off",
    }
  },
  // Overrides para tests (*.spec.*)
  {
    files: ["**/*.spec.*"],
    languageOptions: {
      globals: {
        // Globals de Mocha
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly"
      }
    },
    rules: {
      // Aquí puedes redefinir reglas específicas para tests
    }
  }
];
