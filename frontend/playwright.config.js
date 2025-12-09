import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Use production preview URL in CI with NODE_ENV=production, otherwise dev server
    baseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:4173' : 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'npm run start:backend',
      url: 'http://localhost:3001/services',
      reuseExistingServer: !process.env.CI,
      cwd: '..',
    },
    {
      // Use production preview in CI with NODE_ENV=production, otherwise dev server
      command: process.env.NODE_ENV === 'production' ? 'npm run preview' : 'npm run dev',
      url: process.env.NODE_ENV === 'production' ? 'http://localhost:4173' : 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
