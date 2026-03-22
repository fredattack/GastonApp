import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { TestCredentials } from './global-setup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '../.auth/user.json');
const credentialsFile = path.join(__dirname, '../.auth/credentials.json');

setup('authenticate', async ({ page }) => {
  // Read credentials from file (written by global-setup)
  const credentials: TestCredentials = JSON.parse(
    fs.readFileSync(credentialsFile, 'utf-8'),
  );

  // Navigate to the app to set the origin
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Inject auth token into localStorage
  await page.evaluate(
    ({ token, userId }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user_id', userId);
    },
    { token: credentials.token, userId: credentials.userId },
  );

  // Navigate to dashboard — AuthContext will pick up the token from localStorage
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verify we're not stuck on login
  await expect(page).not.toHaveURL(/\/login/);

  // Save storage state
  await page.context().storageState({ path: authFile });
});
