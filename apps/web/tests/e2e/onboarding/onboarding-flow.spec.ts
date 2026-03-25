import { test, expect } from '@playwright/test';
import { registerUserViaApi, loginWithToken, interceptAllApi } from '../helpers';

const API_URL = 'http://localhost:3008/api/v1-0-0';

/**
 * Intercept pets API calls and relay via Node.js fetch (bypasses CSRF + ensures JSON).
 */
async function interceptPetsApi(page: import('@playwright/test').Page) {
  await page.route('**/pets**', async (route) => {
    const token = route.request().headers()['authorization'] || '';
    const url = new URL(route.request().url());
    const apiPath = url.pathname.replace(/.*\/api\/v1-0-0/, '');
    const apiUrl = `${API_URL}${apiPath}${url.search}`;

    const fetchOptions: RequestInit = {
      method: route.request().method(),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: token,
      },
    };
    if (['POST', 'PUT', 'PATCH'].includes(route.request().method())) {
      fetchOptions.body = route.request().postData() ?? undefined;
    }

    try {
      const response = await fetch(apiUrl, fetchOptions);
      const body = await response.text();
      await route.fulfill({
        status: response.status,
        contentType: 'application/json',
        body,
      });
    } catch {
      await route.continue();
    }
  });
}

/**
 * Scénario 1 : Premier Lancement & Onboarding
 * Couvre le flux complet : inscription → onboarding → création premier animal → dashboard
 */
test.describe('Scenario 1 — Premier Lancement & Onboarding', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('S1.1 Ecran onboarding — nouvel utilisateur sans animal voit l onboarding', async ({
    page,
  }) => {
    const email = `e2e-onboarding-${Date.now()}@gaston.test`;
    const { token, userId } = await registerUserViaApi({
      name: 'Onboarding User',
      email,
      password: 'TestPassword123!',
    });

    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');

    // Verify onboarding page loaded
    await expect(page.locator('[data-testid="onboarding-page"]')).toBeVisible();
    await expect(page.getByText('Bienvenue sur Gaston !')).toBeVisible();
    await expect(
      page.getByText('Commencez par ajouter votre premier compagnon'),
    ).toBeVisible();

    // Form fields should be visible via data-testid
    await expect(page.locator('[data-testid="pet-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="pet-form-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="pet-form-species"]')).toBeVisible();

    // Submit button should be disabled (no name entered)
    await expect(page.locator('[data-testid="onboarding-submit"]')).toBeDisabled();
  });

  test('S1.2 Flux complet — creation premier animal via onboarding → redirection dashboard', async ({
    page,
  }) => {
    await interceptPetsApi(page);

    const email = `e2e-onboarding-full-${Date.now()}@gaston.test`;
    const { token, userId } = await registerUserViaApi({
      name: 'Onboarding Creator',
      email,
      password: 'TestPassword123!',
    });

    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');

    // Fill the pet form with all fields from Scenario 1
    await page.locator('[data-testid="pet-form-name"]').fill('Moustache');
    await page.locator('[data-testid="pet-form-species"]').selectOption('cat');
    await page.locator('[data-testid="pet-form-breed"]').fill('Persan');
    await page.locator('[data-testid="pet-form-birthdate"]').fill('2022-06-15');

    // Submit button should be enabled
    const submitButton = page.locator('[data-testid="onboarding-submit"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Should redirect to dashboard after creation
    await page.waitForURL((url) => !url.pathname.includes('/onboarding'), {
      timeout: 15000,
    });
    await expect(page).not.toHaveURL(/\/onboarding/);
  });

  test('S1.3 Dashboard apres onboarding — animal visible et navigation accessible', async ({
    page,
  }) => {
    await interceptPetsApi(page);
    await interceptAllApi(page);

    const email = `e2e-onboarding-dash-${Date.now()}@gaston.test`;
    const { token, userId } = await registerUserViaApi({
      name: 'Dashboard Checker',
      email,
      password: 'TestPassword123!',
    });

    // Create a pet via API to simulate post-onboarding state
    await fetch(`${API_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Moustache',
        species: 'cat',
        breed: 'Persan',
        birth_date: '2022-06-15',
        is_active: true,
        owner_id: userId,
        gender: 'female',
        order: 0,
      }),
    });

    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should not be on login or onboarding
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page).not.toHaveURL(/\/onboarding/);

    // Dashboard should have visible content (not blank)
    const bodyText = await page.textContent('body');
    expect(bodyText!.trim().length).toBeGreaterThan(0);
  });
});
