import { test, expect } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
  interceptAllApi,
} from '../helpers';

test.describe('Profile', () => {
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

    // Need a pet to avoid onboarding redirect
    await createPetViaApi(token, userId, { name: 'TestPet', species: 'dog' });
  });

  test('8.1 Affichage du profil — nom et email visibles', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Page title
    await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible({ timeout: 15000 });

    // User name should be visible
    await expect(page.getByText(userName)).toBeVisible({ timeout: 10000 });

    // Email label should be visible
    await expect(page.getByText('Email')).toBeVisible();

    // The email address should be visible
    await expect(page.getByText(email)).toBeVisible();
  });

  test('8.2 Persistance du profil — nom et email restent apres reload', async ({ page }) => {
    // NOTE: La modification du nom via UI n'est pas disponible (page profil en lecture seule,
    // pas d'endpoint API de mise a jour profil). Ce test verifie la persistance des donnees
    // apres un reload (equivalent fonctionnel de "modifier → sauvegarder → persiste").
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Verify initial display
    await expect(page.getByText(userName)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(email)).toBeVisible();

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Name and email should persist after reload
    await expect(page.getByText(userName)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(email)).toBeVisible();

    // Logout button should be present
    await expect(page.getByText('Se déconnecter')).toBeVisible();
  });
});
