const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: ['dist', 'node_modules', `auth`, `database`],
  },
  // TypeScript 파일에만 TS 규칙 적용
  {
    extends: [...tseslint.configs.recommended],
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      parserOptions: {
        // monorepo 환경에서 tsconfig 루트 혼동을 방지
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      // TypeScript 관련 규칙들
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',

      // 일반적인 코드 품질 규칙들
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // Node.js 백엔드에 적합한 규칙들
      'no-process-exit': 'error',
      'no-sync': 'warn',
    },
  },
  // JavaScript 파일용 기본 설정 (require 허용)
  {
    extends: [js.configs.recommended],
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      // 일반적인 코드 품질 규칙들
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // Node.js 백엔드에 적합한 규칙들
      'no-process-exit': 'error',
      'no-sync': 'warn',
    },
  }
);
