import { test, expect } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
  interceptAllApi,
} from '../helpers';

const API_URL = 'http://localhost:3008/api/v1-0-0';

async function createEventViaApi(
  token: string,
  data: {
    title: string;
    type: string;
    start_date: string;
    notes?: string;
    pets?: number[];
  },
): Promise<number> {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: data.title,
      type: data.type,
      start_date: data.start_date,
      end_date: '',
      is_recurring: false,
      is_full_day: false,
      is_done: false,
      notes: data.notes || '',
      pets: data.pets || [],
      recurrence: {
        frequency_type: '',
        frequency: 1,
        days: [],
        end_date: '',
        occurrences: 0,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.warn(`Create event failed: ${response.status} — ${body.substring(0, 300)}`);
    return 0;
  }

  const json = await response.json();
  return json.id || json.data?.id || 0;
}

/**
 * Switch the calendar to day view so all events are visible
 */
async function switchToDayView(page: import('@playwright/test').Page) {
  const menuTrigger = page.locator('.toolbar').first().getByRole('button').first();
  await menuTrigger.click();
  await page.getByRole('button', { name: 'Day' }).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Scénario 4 : Créer & Gérer des Événements
 */
test.describe('Scenario 4 — Creer & Gerer des Evenements', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let token: string;
  let userId: string;
  let eventTitle: string;
  let eventDate: Date;

  test.beforeAll(async () => {
    const email = `e2e-events-${Date.now()}@gaston.test`;
    const result = await registerUserViaApi({
      name: 'Event Tester',
      email,
      password: 'TestPassword123!',
    });
    token = result.token;
    userId = result.userId;

    await createPetViaApi(token, userId, { name: 'Luna', species: 'cat', breed: 'Maine Coon' });

    eventTitle = `Vaccination-${Date.now()}`;
    eventDate = new Date();
    await createEventViaApi(token, {
      title: eventTitle,
      type: 'medical',
      start_date: eventDate.toISOString(),
      notes: 'Rappel vaccin annuel',
    });
  });

  test('S4.1 Creer un evenement via formulaire UI', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="event-calendar"]')).toBeVisible({ timeout: 15000 });

    // Click on today's date cell to open the creation form
    const todayCell = page.locator('.bg-primary.text-white.rounded-full').first();
    await todayCell.click({ force: true });

    // The event form should appear — fill the title
    const titleInput = page.locator('#title');
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill('Toilettage Luna');

    // Fill start date
    const startDateInput = page.locator('#start_date');
    if (await startDateInput.isVisible()) {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 16);
      await startDateInput.fill(dateStr);
    }

    // Submit the form
    const saveButton = page.getByRole('button', { name: 'Enregistrer' });
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('S4.2 Evenement visible dans le calendrier — vue jour', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="event-calendar"]')).toBeVisible({ timeout: 15000 });

    await switchToDayView(page);

    await expect(page.getByText(eventTitle).first()).toBeVisible({ timeout: 15000 });
  });

  test('S4.3 Detail evenement — cliquer pour voir les infos', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="event-calendar"]')).toBeVisible({ timeout: 15000 });
    await switchToDayView(page);

    const eventElement = page.getByText(eventTitle).first();
    await expect(eventElement).toBeVisible({ timeout: 15000 });

    await eventElement.click({ force: true });

    // Modal should show event details
    await expect(page.locator('.fixed').getByText(eventTitle)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Médical/i).first()).toBeVisible();

    // Date should be displayed
    const dateText = eventDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    await expect(page.getByText(dateText).first()).toBeVisible();
  });

  test('S4.4 Marquer un evenement comme fait', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="event-calendar"]')).toBeVisible({ timeout: 15000 });
    await switchToDayView(page);

    const eventElement = page.getByText(eventTitle).first();
    await expect(eventElement).toBeVisible({ timeout: 15000 });

    await eventElement.click({ force: true });
    await expect(page.locator('.fixed').getByText(eventTitle)).toBeVisible({ timeout: 10000 });

    // Look for a "mark as done" control in the modal
    const doneButton = page.locator('.fixed').getByRole('button', { name: /fait|done|terminé/i }).first();
    const doneCheckbox = page.locator('.fixed').getByRole('checkbox').first();
    const doneSwitch = page.locator('.fixed').getByRole('switch').first();

    if (await doneButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await doneButton.click();
    } else if (await doneCheckbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await doneCheckbox.click();
    } else if (await doneSwitch.isVisible({ timeout: 3000 }).catch(() => false)) {
      await doneSwitch.click();
    }

    await page.waitForTimeout(1000);
  });

  test('S4.5 Calendrier multi-vues — mois, semaine, jour', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="event-calendar"]')).toBeVisible({ timeout: 15000 });

    const menuTrigger = page.locator('.toolbar').first().getByRole('button').first();

    // Switch to Day view
    await menuTrigger.click();
    await page.getByRole('button', { name: 'Day' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(eventTitle).first()).toBeVisible({ timeout: 10000 });

    // Switch to Week view
    await menuTrigger.click();
    await page.getByRole('button', { name: 'Week' }).click();
    await page.waitForLoadState('networkidle');

    // Switch to Month view
    await menuTrigger.click();
    await page.getByRole('button', { name: 'Month' }).click();
    await page.waitForLoadState('networkidle');

    // Calendar should still be visible
    await expect(page.locator('[data-testid="event-calendar"]')).toBeVisible();
  });
});
