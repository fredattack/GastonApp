import { test, expect } from '@playwright/test';
import {
  getTestCredentials,
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
      pets: [],
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
 * Switch the calendar to day view so all events are visible (month view truncates at 3)
 */
async function switchToDayView(page: import('@playwright/test').Page) {
  // Open the DotsThreeVertical menu (DisplaySettingsDropdown)
  const menuTrigger = page.locator('.toolbar').first().getByRole('button').first();
  await menuTrigger.click();
  // Click "Day" button in the dropdown
  await page.getByRole('button', { name: 'Day' }).click();
  await page.waitForLoadState('networkidle');
}

test.describe('Events', () => {
  // Use shared storageState (global-setup user)
  let eventTitle: string;
  let eventDate: Date;

  test.beforeAll(async () => {
    const creds = getTestCredentials();
    eventTitle = `EVT-${Date.now()}`;
    eventDate = new Date();

    await createEventViaApi(creds.token, {
      title: eventTitle,
      type: 'medical',
      start_date: eventDate.toISOString(),
      notes: 'Rappel vaccin annuel',
    });
  });

  test('6.1 Creer un evenement — visible dans le calendrier', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.event-calendar')).toBeVisible({ timeout: 15000 });

    // Switch to day view to avoid month-view truncation (only shows 3 events per day)
    await switchToDayView(page);

    await expect(page.getByText(eventTitle).first()).toBeVisible({ timeout: 15000 });
  });

  test('6.2 Voir la liste des evenements — infos correctes', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.event-calendar')).toBeVisible({ timeout: 15000 });
    await switchToDayView(page);

    await expect(page.getByText(eventTitle).first()).toBeVisible({ timeout: 15000 });

    // Verify the calendar shows the current date
    const dateStr = eventDate.toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    await expect(page.getByText(new RegExp(dateStr.split(' ').slice(1).join('.*'), 'i')).first()).toBeVisible();
  });

  test('6.3 Voir le detail — cliquer sur un evenement', async ({ page }) => {
    await interceptAllApi(page);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.event-calendar')).toBeVisible({ timeout: 15000 });
    await switchToDayView(page);

    const eventElement = page.getByText(eventTitle).first();
    await expect(eventElement).toBeVisible({ timeout: 15000 });

    // In DayView, the event is inside a nested div; click with force to handle overlay
    await eventElement.click({ force: true });

    // Modal detail — verify title and type are displayed
    await expect(page.locator('.fixed').getByText(eventTitle)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Médical/i).first()).toBeVisible();

    // Date should be displayed in the modal
    const dateText = eventDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    await expect(page.getByText(dateText).first()).toBeVisible();
  });
});
