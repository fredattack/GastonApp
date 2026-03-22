import { test, expect } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
  interceptAllApi,
} from '../helpers';

const API_URL = 'http://localhost:3008/api/v1-0-0';

/**
 * Create an event via API
 */
async function createEventViaApi(
  token: string,
  data: {
    title: string;
    type: string;
    start_date: string;
    pets?: number[];
    notes?: string;
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
      pets: (data.pets || []).map((id) => ({
        id,
        pivot: { item: data.title, quantity: '1' },
      })),
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

test.describe('Events', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let token: string;
  let userId: string;
  let petId: string;
  let eventId: number;
  const eventTitle = `Vaccination E2E ${Date.now()}`;
  const eventDate = new Date();

  test.beforeAll(async () => {
    const email = `e2e-events-${Date.now()}@gaston.test`;
    const result = await registerUserViaApi({
      name: 'Event Tester',
      email,
      password: 'TestPassword123!',
    });
    token = result.token;
    userId = result.userId;

    // Create a pet
    petId = await createPetViaApi(token, userId, { name: 'Luna', species: 'cat', breed: 'Maine Coon' });

    // Create a medical event for today (no pets pivot — medical type does not require petId)
    eventId = await createEventViaApi(token, {
      title: eventTitle,
      type: 'medical',
      start_date: eventDate.toISOString(),
      notes: 'Rappel vaccin annuel',
    });
    console.log(`[E2E Events] Created event ID: ${eventId} — title: ${eventTitle}`);
  });

  test('6.1 Creer un evenement — visible dans le calendrier', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    // The calendar should be visible
    await expect(page.locator('.event-calendar')).toBeVisible({ timeout: 15000 });

    // The event title should appear in the calendar grid
    await expect(page.getByText(eventTitle).first()).toBeVisible({ timeout: 15000 });
  });

  test('6.2 Voir la liste des evenements — infos correctes', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    // Wait for calendar to load
    await expect(page.locator('.event-calendar')).toBeVisible({ timeout: 15000 });

    // Event should be visible with its title
    const eventElement = page.getByText(eventTitle).first();
    await expect(eventElement).toBeVisible({ timeout: 15000 });

    // Verify the calendar shows the current month
    const monthName = eventDate.toLocaleDateString('fr-FR', { month: 'long' });
    await expect(page.getByText(new RegExp(monthName, 'i')).first()).toBeVisible();
  });

  test('6.3 Voir le detail — cliquer sur un evenement', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    // Wait for event to be visible in calendar
    const eventElement = page.getByText(eventTitle).first();
    await expect(eventElement).toBeVisible({ timeout: 15000 });

    // Click on the event to open detail modal
    await eventElement.click();

    // Modal should open with event details
    // Title should be visible in the modal header
    await expect(page.locator('.fixed').getByText(eventTitle)).toBeVisible({ timeout: 10000 });

    // Type label "Medical" should be visible
    await expect(page.getByText(/Médical/i).first()).toBeVisible();

    // Date should be displayed
    const dateText = eventDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    await expect(page.getByText(dateText).first()).toBeVisible();

    // Notes should be visible
    await expect(page.getByText('Rappel vaccin annuel')).toBeVisible();
  });
});
