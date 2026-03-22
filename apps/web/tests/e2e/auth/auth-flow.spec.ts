import { test, expect } from '@playwright/test';
import { registerUserViaApi, loginWithToken, createPetViaApi } from '../helpers';

const API_URL = 'http://localhost:3008/api/v1-0-0';

/**
 * Intercept browser POST auth calls and relay them via Node.js fetch (bypasses CSRF).
 * The actual API is called — only the transport layer changes.
 */
async function interceptAuthApi(page: import('@playwright/test').Page) {
  for (const endpoint of ['auth/register', 'auth/login', 'auth/logout']) {
    await page.route(`**/${endpoint}`, async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const authHeader = route.request().headers()['authorization'];
      if (authHeader) headers['Authorization'] = authHeader;
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers,
        body: route.request().postData() ?? undefined,
      });
      const body = await response.text();
      await route.fulfill({
        status: response.status,
        contentType: 'application/json',
        body,
      });
    });
  }
}

test.describe('Auth Flow', () => {
  // 1.1 & 1.2 utilisent interceptAuthApi pour bypass CSRF sur les POST
  // 1.3 utilise le storageState partagé (lecture seule)
  // 1.4 crée son propre user (le logout invalide le token)

  test('1.1 Inscription — formulaire register → redirection app → user connecte', async ({
    page,
  }) => {
    await interceptAuthApi(page);

    const uniqueEmail = `e2e-register-${Date.now()}@gaston.test`;

    await page.goto('/register');

    await page.getByLabel('Nom complet').fill('Test Register User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Mot de passe', { exact: true }).fill('TestPassword123!');
    await page.getByLabel('Confirmer le mot de passe').fill('TestPassword123!');

    await page.getByRole('button', { name: "S'inscrire" }).click();

    // New user without pets → should land on onboarding or dashboard
    await page.waitForURL((url) => !url.pathname.includes('/register'), {
      timeout: 15000,
    });
    await expect(page).not.toHaveURL(/\/register/);
  });

  test('1.2 Connexion — email + password → redirection dashboard', async ({
    page,
  }) => {
    await interceptAuthApi(page);

    // Create a dedicated user for this test
    const email = `e2e-login-${Date.now()}@gaston.test`;
    const password = 'TestPassword123!';
    await registerUserViaApi({ name: 'Login Test User', email, password });

    await page.goto('/login');

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Mot de passe').fill(password);

    await page.getByRole('button', { name: 'Se connecter' }).click();

    await page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: 15000,
    });
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('1.3 Persistance session — reload page → user toujours connecte', async ({
    page,
  }) => {
    // Uses shared storageState (read-only, no state mutation)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).not.toHaveURL(/\/login/);

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page).not.toHaveURL(/\/login/);
  });

  test('1.4 Deconnexion — clic deconnexion → redirection login', async ({
    page,
  }) => {
    // Create a dedicated user for this test (logout invalidates the token)
    const email = `e2e-logout-${Date.now()}@gaston.test`;
    const password = 'TestPassword123!';
    const { token, userId } = await registerUserViaApi({
      name: 'Logout Test User',
      email,
      password,
    });
    // Create a pet so the user doesn't get stuck on onboarding
    await createPetViaApi(token, userId, { name: 'TempPet', species: 'cat' });

    // Inject this user's auth into the browser
    await page.goto('/login');
    await loginWithToken(page, token, userId);

    // Mock logout POST to avoid CSRF (but still test the frontend behavior)
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

    await page.getByRole('button', { name: 'Se déconnecter' }).click();

    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);

    // Login page elements visible
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();
  });
});
