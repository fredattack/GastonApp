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
 * Scénario 3 : Dashboard Alimentation (actions)
 * Couvre : marquage individuel, undo, batch par espèce, persistance
 */
test.describe('Scenario 3 — Alimentation Actions', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let token: string;
  let userId: string;

  test.beforeAll(async () => {
    const email = `e2e-feeding-act-${Date.now()}@gaston.test`;
    const result = await registerUserViaApi({
      name: 'Feeding Actor',
      email,
      password: 'TestPassword123!',
    });
    token = result.token;
    userId = result.userId;

    const dog1Id = await createPetViaApi(token, userId, { name: 'Rex', species: 'dog', breed: 'Berger' });
    const dog2Id = await createPetViaApi(token, userId, { name: 'Max', species: 'dog', breed: 'Husky' });
    const catId = await createPetViaApi(token, userId, { name: 'Felix', species: 'cat', breed: 'Persan' });

    for (const petId of [dog1Id, dog2Id, catId]) {
      for (const slot of ['morning', 'noon', 'evening']) {
        await createFeedingScheduleViaApi(token, petId, {
          meal_slot: slot,
          food_type: 'Croquettes',
          quantity: 150,
          unit: 'g',
        });
      }
    }
  });

  test('S3.4 Marquer un repas individuel — optimistic update et persistance', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="feeding-title"]')).toBeVisible({ timeout: 15000 });

    // Mark Rex as fed via data-testid
    const rexToggle = page.locator('[data-testid="feeding-toggle-Rex"]').first();
    await expect(rexToggle).toBeVisible({ timeout: 10000 });
    await rexToggle.click();

    // Optimistic update: toggle should turn green
    await expect(rexToggle).toHaveClass(/bg-green-500/, { timeout: 5000 });

    // Verify persistence: reload and check state is still marked
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="feeding-toggle-Rex"]').first()).toHaveClass(/bg-green-500/, { timeout: 15000 });
  });

  test('S3.5 Annuler un repas (undo) — revenir a non donne', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="feeding-title"]')).toBeVisible({ timeout: 15000 });

    // Mark Felix as fed first
    const felixToggle = page.locator('[data-testid="feeding-toggle-Felix"]').first();
    await expect(felixToggle).toBeVisible({ timeout: 10000 });
    await felixToggle.click();

    // Verify it's marked (green)
    await expect(felixToggle).toHaveClass(/bg-green-500/, { timeout: 5000 });

    // Now undo (click again)
    await felixToggle.click();

    // Should revert to unmarked state (border style, not green)
    await expect(felixToggle).toHaveClass(/border-2/, { timeout: 10000 });
    await expect(felixToggle).not.toHaveClass(/bg-green-500/);
  });

  test('S3.6 Marquer en batch — tous les chiens nourris en 1 clic', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="feeding-title"]')).toBeVisible({ timeout: 15000 });

    // Find the batch action button for dogs via data-testid
    const batchButton = page.getByRole('button', { name: /Tous les chiens nourris/i });
    await expect(batchButton).toBeVisible({ timeout: 10000 });

    // Click the batch button
    await batchButton.click();

    // All dogs should now be marked (batch button disappears when all marked)
    await expect(batchButton).not.toBeVisible({ timeout: 10000 });
  });
});
