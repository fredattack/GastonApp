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

test.describe('Feeding Actions', () => {
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

    // Create two dogs and one cat
    const dog1Id = await createPetViaApi(token, userId, { name: 'Rex', species: 'dog', breed: 'Berger' });
    const dog2Id = await createPetViaApi(token, userId, { name: 'Max', species: 'dog', breed: 'Husky' });
    const catId = await createPetViaApi(token, userId, { name: 'Felix', species: 'cat', breed: 'Persan' });

    // Create morning schedules for all
    for (const petId of [dog1Id, dog2Id, catId]) {
      await createFeedingScheduleViaApi(token, petId, {
        meal_slot: 'morning',
        food_type: 'Croquettes',
        quantity: 150,
        unit: 'g',
      });
      await createFeedingScheduleViaApi(token, petId, {
        meal_slot: 'noon',
        food_type: 'Croquettes',
        quantity: 150,
        unit: 'g',
      });
      await createFeedingScheduleViaApi(token, petId, {
        meal_slot: 'evening',
        food_type: 'Croquettes',
        quantity: 150,
        unit: 'g',
      });
    }
  });

  test('5.1 Marquer un repas individuel — optimistic update visible', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Repas du jour' })).toBeVisible({ timeout: 15000 });

    // Mark Rex as fed
    const rexToggle = page.getByRole('button', { name: /Marquer Rex comme nourri/i }).first();
    await expect(rexToggle).toBeVisible({ timeout: 10000 });
    await rexToggle.click();

    // Optimistic update: undo button should appear immediately (no spinner)
    const undoRex = page.getByRole('button', { name: /Annuler Rex/i }).first();
    await expect(undoRex).toBeVisible({ timeout: 5000 });

    // Verify persistence: reload and check state is still marked
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: /Annuler Rex/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test('5.2 Marquer un batch — tous les chiens nourris', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Repas du jour' })).toBeVisible({ timeout: 15000 });

    // Find the batch action button for dogs
    const batchButton = page.getByRole('button', { name: /Tous les chiens nourris/i });
    await expect(batchButton).toBeVisible({ timeout: 10000 });

    // Click the batch button
    await batchButton.click();

    // All dogs should now be marked (undo buttons visible)
    // The batch button should disappear (all dogs are marked)
    await expect(batchButton).not.toBeVisible({ timeout: 10000 });
  });

  test('5.3 Annuler un repas (undo) — revenir a non donne', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Repas du jour' })).toBeVisible({ timeout: 15000 });

    // Mark Felix as fed first
    const felixToggle = page.getByRole('button', { name: /Marquer Felix comme nourri/i }).first();
    await expect(felixToggle).toBeVisible({ timeout: 10000 });
    await felixToggle.click();

    // Verify it's marked
    const undoFelix = page.getByRole('button', { name: /Annuler Felix/i }).first();
    await expect(undoFelix).toBeVisible({ timeout: 5000 });

    // Now undo
    await undoFelix.click();

    // The "Marquer" button should reappear
    await expect(page.getByRole('button', { name: /Marquer Felix comme nourri/i }).first()).toBeVisible({ timeout: 10000 });
  });
});
