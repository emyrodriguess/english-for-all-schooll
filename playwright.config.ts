import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  workers: process.env.CI ? 2 : 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:3100",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      testIgnore: /progressive-enhancement\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-mobile",
      testIgnore: /progressive-enhancement\.spec\.ts/,
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "firefox-desktop",
      testIgnore: /progressive-enhancement\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit-iphone",
      testIgnore: /progressive-enhancement\.spec\.ts/,
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "no-javascript",
      testMatch: /progressive-enhancement\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], javaScriptEnabled: false },
    },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
