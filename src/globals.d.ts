/// <reference types="node" />

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      // Add other env vars here
    }
  }
}