import { test, expect } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
  interceptAllApi,
} from '../helpers';

const API_URL = 'http://localhost:3008/api/v1-0-0';

async function createFeedingScheduleViaApi(
  token: string,
  petId: string,
  data: { meal_slot: string; food_type: string; quantity: number; unit: string },
): Promise<number> {
  const response = await fetch(`${API_URL}/feeding/schedules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      pet_id: Number(petId),
      meal_slot: data.meal_slot,
      food_type: data.food_type,
      quantity: data.quantity,
      unit: data.unit,
      is_active: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.warn(`Create feeding schedule failed: ${response.status} — ${body.substring(0, 300)}`);
    return 0;
  }

  const json = await response.json();
  return json.id || json.data?.id || 0;
}

/**
 * Scénario 3 : Dashboard Alimentation Quotidienne (affichage)
 */
test.describe('Scenario 3 — Dashboard Alimentation (affichage)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let token: string;
  let userId: string;

  test.beforeAll(async () => {
    const email = `e2e-feeding-dash-${Date.now()}@gaston.test`;
    const result = await registerUserViaApi({
      name: 'Feeding Tester',
      email,
      password: 'TestPassword123!',
    });
    token = result.token;
    userId = result.userId;

    const petId1 = await createPetViaApi(token, userId, { name: 'Buddy', species: 'dog', breed: 'Labrador' });
    const petId2 = await createPetViaApi(token, userId, { name: 'Minou', species: 'cat', breed: 'Siamois' });

    for (const slot of ['morning', 'noon', 'evening']) {
      await createFeedingScheduleViaApi(token, petId1, {
        meal_slot: slot,
        food_type: 'Croquettes',
        quantity: 200,
        unit: 'g',
      });
      await createFeedingScheduleViaApi(token, petId2, {
        meal_slot: slot,
        food_type: 'Patee',
        quantity: 100,
        unit: 'g',
      });
    }
  });

  test('S3.1 Affichage du dashboard — date du jour, titre et animaux visibles', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    // Title via data-testid
    await expect(page.locator('[data-testid="feeding-title"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="feeding-dashboard"]')).toBeVisible();

    // Pet names should appear via data-testid
    await expect(page.locator('[data-testid="feeding-pet-row-Buddy"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="feeding-pet-row-Minou"]').first()).toBeVisible();
  });

  test('S3.2 Creneaux repas — tabs matin, midi, soir avec compteur', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    // Slot tabs via data-testid
    await expect(page.locator('[data-testid="feeding-slot-tabs"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="feeding-slot-morning"]')).toBeVisible();
    await expect(page.locator('[data-testid="feeding-slot-noon"]')).toBeVisible();
    await expect(page.locator('[data-testid="feeding-slot-evening"]')).toBeVisible();

    // Each tab should show a count (e.g. "2/2" or "0/2")
    await expect(page.locator('[data-testid="feeding-slot-morning"]')).toContainText(/\d+\/\d+/);

    // Click on "Midi" tab
    await page.locator('[data-testid="feeding-slot-noon"]').click();

    // Pets should still be visible in the noon slot
    await expect(page.locator('[data-testid="feeding-pet-row-Buddy"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="feeding-pet-row-Minou"]').first()).toBeVisible();
  });

  test('S3.3 Etat visuel — distinction entre repas marque et non marque', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="feeding-title"]')).toBeVisible({ timeout: 15000 });

    // Find the toggle button for Buddy via data-testid
    const buddyToggle = page.locator('[data-testid="feeding-toggle-Buddy"]').first();
    await expect(buddyToggle).toBeVisible({ timeout: 10000 });

    // Before marking: should have border style (not marked)
    await expect(buddyToggle).toHaveClass(/border-2/);
    await expect(buddyToggle).not.toHaveClass(/bg-green-500/);

    // Mark Buddy as fed
    await buddyToggle.click();

    // After marking: the toggle should have green bg (marked state)
    await expect(buddyToggle).toHaveClass(/bg-green-500/, { timeout: 10000 });
  });
});
