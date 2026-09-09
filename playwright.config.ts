import { defineConfig } from '@playwright/test';

const baseURL = 'http://localhost:3110';
const secret = process.env.BETTER_AUTH_SECRET ?? 'e2e-only-secret-for-local-tests-not-production';
process.env.BETTER_AUTH_SECRET = secret;

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  use: { baseURL, trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm start --port 3110',
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
    env: { BETTER_AUTH_SECRET: secret, BETTER_AUTH_URL: baseURL, NEXT_PUBLIC_APP_URL: baseURL },
  },
});
