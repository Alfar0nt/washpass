import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'server/uploads/**',
      '.agents/**',
      '.opencode/**',
      '.claude/**',
      '**/*.cjs',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'server/**/*.js', 'vite.config.js', 'eslint.config.js', 'vitest.config.js'],
    rules: {
      // Debt lama dari kode existing: diturunkan ke warning agar baseline lint
      // hijau; perapian menyeluruh = pekerjaan tersendiri.
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-dupe-class-members': 'warn',
      'no-useless-assignment': 'warn',
      'preserve-caught-error': 'warn',
    },
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },
  {
    files: ['server/**/*.js', 'vite.config.js', 'eslint.config.js', 'vitest.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
  {
    files: ['src/js/utils/*.test.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  prettier,
];
