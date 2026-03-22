import { test, expect } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
  interceptAllApi,
} from '../helpers';

const API_URL = 'http://localhost:3008/api/v1-0-0';

/**
 * Create a feeding schedule for a pet via API
 */
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

test.describe('Feeding Dashboard', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let token: string;
  let userId: string;
  let petId1: string;
  let petId2: string;

  test.beforeAll(async () => {
    const email = `e2e-feeding-dash-${Date.now()}@gaston.test`;
    const result = await registerUserViaApi({
      name: 'Feeding Tester',
      email,
      password: 'TestPassword123!',
    });
    token = result.token;
    userId = result.userId;

    // Create two pets: a dog and a cat
    petId1 = await createPetViaApi(token, userId, { name: 'Buddy', species: 'dog', breed: 'Labrador' });
    petId2 = await createPetViaApi(token, userId, { name: 'Minou', species: 'cat', breed: 'Siamois' });

    // Create feeding schedules for morning, noon and evening
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

  test('4.1 Affichage du dashboard — titre et animaux visibles', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    // Title "Repas du jour" is visible
    await expect(page.getByRole('heading', { name: 'Repas du jour' })).toBeVisible({ timeout: 15000 });

    // Pet names should appear in the feeding rows
    await expect(page.getByRole('button', { name: 'Buddy' }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Minou' }).first()).toBeVisible();
  });

  test('4.2 Affichage des creneaux repas — tabs matin, midi, soir', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    // Slot tabs should be visible
    await expect(page.getByRole('button', { name: /Matin/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Midi/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Soir/i })).toBeVisible();

    // Each tab should show a count (e.g. "2/2" or "0/2")
    const morningTab = page.getByRole('button', { name: /Matin/i });
    await expect(morningTab).toContainText(/\d+\/\d+/);

    // Click on "Midi" tab
    await page.getByRole('button', { name: /Midi/i }).click();

    // Pets should still be visible in the noon slot
    await expect(page.getByRole('button', { name: 'Buddy' }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Minou' }).first()).toBeVisible();
  });

  test('4.3 Etat visuel des repas — distinguer marque et non marque', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await expect(page.getByRole('heading', { name: 'Repas du jour' })).toBeVisible({ timeout: 15000 });

    // Find the first toggle button for Buddy (not yet marked)
    const buddyToggle = page.getByRole('button', { name: /Marquer Buddy comme nourri/i }).first();
    await expect(buddyToggle).toBeVisible({ timeout: 10000 });

    // Before marking: the toggle button should have border style (not marked)
    await expect(buddyToggle).toHaveClass(/border-2/);
    await expect(buddyToggle).not.toHaveClass(/bg-green-500/);

    // Mark Buddy as fed
    await buddyToggle.click();

    // After marking: the undo button should appear — "Annuler Buddy"
    const undoButton = page.getByRole('button', { name: /Annuler Buddy/i }).first();
    await expect(undoButton).toBeVisible({ timeout: 10000 });

    // The undo button should have green bg (marked state)
    await expect(undoButton).toHaveClass(/bg-green-500/);
  });
});
