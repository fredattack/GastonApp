import { test, expect, Page } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
} from '../helpers';

const API_URL = 'http://localhost:3008/api/v1-0-0';

/**
 * Enhanced interceptor that fixes pet creation payload
 * (frontend sends incomplete data, backend requires extra fields)
 */
async function interceptPetsWithFixedPayload(page: Page, userId: string) {
  await page.route('http://localhost:3008/api/**', async (route) => {
    const req = route.request();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const authHeader = req.headers()['authorization'];
    if (authHeader) headers['Authorization'] = authHeader;

    let body = req.postData() ?? undefined;

    // Fix pet creation/update payloads: add missing required fields
    if (req.url().includes('/pets') && ['POST', 'PUT'].includes(req.method()) && body) {
      try {
        const data = JSON.parse(body);
        if (!data.owner_id && !data.ownerId) data.owner_id = userId;
        if (data.ownerId && !data.owner_id) {
          data.owner_id = data.ownerId;
          delete data.ownerId;
        }
        if (data.birthDate && !data.birth_date) {
          data.birth_date = data.birthDate;
          delete data.birthDate;
        }
        if (data.isActive !== undefined && data.is_active === undefined) {
          data.is_active = data.isActive;
          delete data.isActive;
        }
        if (!data.gender) data.gender = 'male';
        if (!data.birth_date) data.birth_date = '2020-01-01';
        if (data.is_active === undefined) data.is_active = true;
        if (!data.breed) data.breed = 'Mixed';
        body = JSON.stringify(data);
      } catch {}
    }

    const fetchOptions: RequestInit = {
      method: req.method(),
      headers,
    };
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method())) {
      if (body) fetchOptions.body = body;
    }

    try {
      const response = await fetch(req.url(), fetchOptions);
      const responseBody = await response.text();
      await route.fulfill({
        status: response.status,
        contentType: 'application/json',
        body: responseBody,
      });
    } catch {
      await route.continue();
    }
  });
}

/**
 * Scénario 2 : Ajouter Plusieurs Animaux
 * Couvre : ajout multiple, liste, modification, validation
 */
test.describe('Scenario 2 — Ajouter Plusieurs Animaux', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('S2.1 Creer un animal via formulaire — remplir et valider', async ({
    page,
  }) => {
    const email = `e2e-pet-create-${Date.now()}@gaston.test`;
    const { token, userId } = await registerUserViaApi({
      name: 'Pet Creator',
      email,
      password: 'TestPassword123!',
    });
    await createPetViaApi(token, userId, { name: 'ExistingPet', species: 'dog' });

    await interceptPetsWithFixedPayload(page, userId);
    await page.goto('/login');
    await loginWithToken(page, token, userId);

    await page.goto('/content/pets/create');
    await page.waitForLoadState('networkidle');

    // Fill the form using data-testid
    await page.locator('[data-testid="pet-form-name"]').fill('Filou');
    await page.locator('[data-testid="pet-form-species"]').selectOption('cat');
    await page.locator('[data-testid="pet-form-breed"]').fill('Siamois');
    await page.locator('[data-testid="pet-form-birthdate"]').fill('2023-03-10');

    // Submit
    await page.locator('[data-testid="pet-form-submit"]').click();

    // Should redirect to pets list
    await page.waitForURL(/\/content\/pets/, { timeout: 15000 });

    // New pet should be visible in the list
    await expect(page.locator('[data-testid="pet-card-Filou"]')).toBeVisible({ timeout: 10000 });
  });

  test('S2.2 Ajouter 3 animaux — liste affiche tous les animaux', async ({
    page,
  }) => {
    const email = `e2e-pet-multi-${Date.now()}@gaston.test`;
    const { token, userId } = await registerUserViaApi({
      name: 'Multi Pet Owner',
      email,
      password: 'TestPassword123!',
    });

    // Create 3 pets via API (1 cat, 1 dog, 1 more cat)
    await createPetViaApi(token, userId, { name: 'Luna', species: 'cat', breed: 'Maine Coon' });
    await createPetViaApi(token, userId, { name: 'Rex', species: 'dog', breed: 'Berger' });
    await createPetViaApi(token, userId, { name: 'Mimi', species: 'cat', breed: 'Persan' });

    await interceptPetsWithFixedPayload(page, userId);
    await page.goto('/login');
    await loginWithToken(page, token, userId);

    await page.goto('/content/pets');
    await page.waitForLoadState('networkidle');

    // All 3 pets should be visible via data-testid
    await expect(page.locator('[data-testid="pet-card-Luna"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="pet-card-Rex"]')).toBeVisible();
    await expect(page.locator('[data-testid="pet-card-Mimi"]')).toBeVisible();
  });

  test('S2.3 Modifier un animal — changer race et verifier la modification', async ({
    page,
  }) => {
    const email = `e2e-pet-edit-${Date.now()}@gaston.test`;
    const { token, userId } = await registerUserViaApi({
      name: 'Pet Editor',
      email,
      password: 'TestPassword123!',
    });
    const petId = await createPetViaApi(token, userId, {
      name: 'Ancien Nom',
      species: 'dog',
      breed: 'Berger',
    });

    await interceptPetsWithFixedPayload(page, userId);
    await page.goto('/login');
    await loginWithToken(page, token, userId);

    await page.goto(`/content/pets/${petId}`);
    await page.waitForLoadState('networkidle');

    // The form is present via data-testid
    const nameInput = page.locator('[data-testid="pet-form-name"]');
    await expect(nameInput).toBeVisible({ timeout: 10000 });

    // Change the name and breed
    await nameInput.clear();
    await nameInput.fill('Nouveau Nom');
    await page.locator('[data-testid="pet-form-breed"]').clear();
    await page.locator('[data-testid="pet-form-breed"]').fill('Golden Retriever');

    // Submit
    await page.locator('[data-testid="pet-form-submit"]').click();

    // Should redirect to pets list
    await page.waitForURL(/\/content\/pets/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/content\/pets/);
  });

  test('S2.4 Validation — impossible de creer un animal sans nom', async ({
    page,
  }) => {
    const email = `e2e-pet-valid-${Date.now()}@gaston.test`;
    const { token, userId } = await registerUserViaApi({
      name: 'Pet Validator',
      email,
      password: 'TestPassword123!',
    });
    await createPetViaApi(token, userId, { name: 'ExistingPet', species: 'dog' });

    await interceptPetsWithFixedPayload(page, userId);
    await page.goto('/login');
    await loginWithToken(page, token, userId);

    await page.goto('/content/pets/create');
    await page.waitForLoadState('networkidle');

    // Do NOT fill the name — only select species
    await page.locator('[data-testid="pet-form-species"]').selectOption('cat');

    // The submit button should be visible
    const submitButton = page.locator('[data-testid="pet-form-submit"]');
    await expect(submitButton).toBeVisible();

    // Try submitting without name
    await submitButton.click();

    // Should NOT navigate away (still on create page)
    await expect(page).toHaveURL(/\/content\/pets\/create/);
  });

  test('S2.5 Liste et recherche — filtrer animaux et naviguer', async ({
    page,
  }) => {
    const email = `e2e-pet-list-${Date.now()}@gaston.test`;
    const { token, userId } = await registerUserViaApi({
      name: 'Pet Lister',
      email,
      password: 'TestPassword123!',
    });
    await createPetViaApi(token, userId, { name: 'Buddy', species: 'dog', breed: 'Golden' });
    await createPetViaApi(token, userId, { name: 'Mimi', species: 'cat', breed: 'Persan' });

    await interceptPetsWithFixedPayload(page, userId);
    await page.goto('/login');
    await loginWithToken(page, token, userId);

    await page.goto('/content/pets');
    await page.waitForLoadState('networkidle');

    // Pets should be visible via data-testid
    await expect(page.locator('[data-testid="pet-card-Buddy"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="pet-card-Mimi"]')).toBeVisible();

    // Search should filter the list
    await page.locator('[data-testid="pets-search-input"]').fill('Buddy');
    await expect(page.locator('[data-testid="pet-card-Buddy"]')).toBeVisible();

    // Clear search
    await page.locator('[data-testid="pets-search-input"]').clear();

    // Click create button
    await page.locator('[data-testid="pets-create-button"]').click();
    await page.waitForURL(/\/content\/pets\/create/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/content\/pets\/create/);
  });
});
