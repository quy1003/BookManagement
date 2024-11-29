import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers:1,
  rootDir: './', // Định nghĩa lại rootDir
  testMatch: ['**/__tests__/**/*.test.ts']
};

export default config;
