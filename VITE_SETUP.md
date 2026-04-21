# Vite React Checkstyle Setup Guide

This guide explains how to port the "checkstyle" (ESLint + Prettier) configuration from this Next.js project to a Vite React project.

## Quick Answer: Yes, 90% Reusable

The ESLint and Prettier configuration is **90% identical** between Next.js and Vite React. Only the ESLint framework-specific plugins differ.

---

## 1. Dependencies

### Next.js (Already Done Here)

```bash
npm install -D prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y husky lint-staged
# Plus: eslint-config-next is included
```

### Vite React (Equivalent Setup)

```bash
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh typescript-eslint @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y husky lint-staged
```

**Key Difference:**

- Next.js uses: `eslint-config-next` (includes React + TypeScript rules)
- Vite uses: `eslint-plugin-react` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` + `typescript-eslint`

---

## 2. ESLint Config (`eslint.config.js` for Vite)

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },

  // Base JS/TS configs
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // React configs
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],

  // Import & Accessibility
  importPlugin.flatConfigs.recommended,
  jsxA11y.flatConfigs.recommended,

  // Prettier (must be last)
  eslintPluginPrettier,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // === SAME CHECKSTYLE RULES AS NEXT.JS ===

      // React
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/prop-types': 'off',

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // Import Order (Java-like)
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error',

      // Code Quality
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
    },
  }
);
```

---

## 3. Prettier Config (Identical)

**`.prettierrc`** — Same file works for both:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 4. Package.json Scripts (Identical)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{js,mjs,cjs,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,mjs,cjs,ts,tsx,json,css,md}\"",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{js,mjs,cjs,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

---

## 5. Pre-commit Hook (Identical)

**`.husky/pre-commit`**:

```bash
npx lint-staged
```

---

## Summary Table

| Feature              | Next.js Config           | Vite Config                                 |
| -------------------- | ------------------------ | ------------------------------------------- |
| ESLint Core          | `eslint-config-next`     | `eslint-plugin-react` + `typescript-eslint` |
| React Hooks          | Included in Next.js      | `eslint-plugin-react-hooks`                 |
| Fast Refresh         | Built-in                 | `eslint-plugin-react-refresh`               |
| Import Order         | `eslint-plugin-import`   | `eslint-plugin-import` (same)               |
| Accessibility        | `eslint-plugin-jsx-a11y` | `eslint-plugin-jsx-a11y` (same)             |
| Prettier             | `eslint-plugin-prettier` | `eslint-plugin-prettier` (same)             |
| Pre-commit           | `husky` + `lint-staged`  | `husky` + `lint-staged` (same)              |
| **Checkstyle Rules** | **90% identical**        | **90% identical**                           |

---

## Quick Start for Vite

1. Create Vite project: `npm create vite@latest my-app -- --template react-ts`
2. Copy `.prettierrc` from this project
3. Create `eslint.config.js` using the Vite version above
4. Install dependencies listed in section 1
5. Add scripts and lint-staged to `package.json`
6. Run `npx husky init && echo "npx lint-staged" > .husky/pre-commit`
7. Done! You now have Java Checkstyle equivalent for React.
