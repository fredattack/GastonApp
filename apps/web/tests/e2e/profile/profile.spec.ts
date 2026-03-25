import { test, expect } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
  interceptAllApi,
} from '../helpers';

/**
 * Scénario 8 : Profil & Dark Mode
 *
 * Note : Le toggle dark mode est actuellement commenté dans Header.tsx.
 * Le test S8.4 vérifie gracieusement si le toggle existe et le teste si présent.
 */
test.describe('Scenario 8 — Profil & Dark Mode', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let token: string;
  let userId: string;
  let email: string;
  const userName = 'Profile Tester';

  test.beforeAll(async () => {
    email = `e2e-profile-${Date.now()}@gaston.test`;
    const result = await registerUserViaApi({
      name: userName,
      email,
      password: 'TestPassword123!',
    });
    token = result.token;
    userId = result.userId;

    await createPetViaApi(token, userId, { name: 'TestPet', species: 'dog' });
  });

  test('S8.1 Affichage du profil — nom, email et date membre visibles', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Page via data-testid
    await expect(page.locator('[data-testid="profile-page"]')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible();

    // User name via data-testid
    await expect(page.locator('[data-testid="profile-user-name"]')).toContainText(userName);

    // Email via data-testid
    await expect(page.locator('[data-testid="profile-user-email"]')).toContainText(email);

    // "Membre depuis" label should be visible
    await expect(page.getByText(/Membre depuis/i)).toBeVisible();
  });

  test('S8.2 Persistance du profil — infos restent apres reload', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Verify initial display
    await expect(page.locator('[data-testid="profile-user-name"]')).toContainText(userName, { timeout: 15000 });
    await expect(page.locator('[data-testid="profile-user-email"]')).toContainText(email);

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="profile-user-name"]')).toContainText(userName, { timeout: 15000 });
    await expect(page.locator('[data-testid="profile-user-email"]')).toContainText(email);
  });

  test('S8.3 Deconnexion depuis profil — bouton present et fonctionnel', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);

    // Mock logout POST to avoid CSRF
    await page.route('**/auth/logout', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
      });
    });

    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Logout button via data-testid
    const logoutButton = page.locator('[data-testid="profile-logout-button"]');
    await expect(logoutButton).toBeVisible({ timeout: 10000 });

    await logoutButton.click();

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('S8.4 Dark mode — toggle theme si disponible', async ({ page }) => {
    // NOTE: Le toggle dark mode est actuellement commenté dans Header.tsx.
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="profile-page"]')).toBeVisible({ timeout: 15000 });

    // Check if dark mode toggle exists (it may be commented out)
    const themeToggle = page.locator('button:has([class*="sun"]), button:has([class*="moon"])');
    const toggleExists = await themeToggle.isVisible({ timeout: 3000 }).catch(() => false);

    if (toggleExists) {
      await themeToggle.click();
      await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible();
      await expect(page.locator('[data-testid="profile-user-name"]')).toContainText(userName);

      // Switch back
      await themeToggle.click();
      await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible();
    }

    // Regardless of dark mode, profile should be readable
    await expect(page.locator('[data-testid="profile-user-name"]')).toContainText(userName);
    await expect(page.locator('[data-testid="profile-user-email"]')).toContainText(email);
  });
});
