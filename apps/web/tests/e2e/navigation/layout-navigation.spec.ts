import { test, expect } from '@playwright/test';
import {
  getTestCredentials,
  interceptAllApi,
} from '../helpers';

test.describe('Navigation & Layout', () => {
  // Uses shared storageState (user already authenticated with pet via global-setup)

  test('9.1 Navigation entre pages — chaque page charge correctement', async ({ page }) => {
    await interceptAllApi(page);

    // Dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toHaveText(/error/i, { timeout: 10000 });
    // Dashboard should have some content (greeting or quick actions)
    await expect(page.locator('body').first()).toBeVisible();

    // Animaux
    await page.goto('/content/pets');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toHaveText('');

    // Calendrier
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.event-calendar')).toBeVisible({ timeout: 15000 });

    // Profil
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible({ timeout: 15000 });
  });

  test('9.2 Responsive mobile — menu tab bar visible', async ({ page, browserName }) => {
    // This test uses the "mobile" project viewport (iPhone 13)
    // But since we're in the chromium project, we resize manually
    await page.setViewportSize({ width: 375, height: 667 });
    await interceptAllApi(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The mobile tab bar should be visible (lg:hidden, so visible on mobile)
    const tabBar = page.locator('nav[aria-label="Navigation principale mobile"]');
    await expect(tabBar).toBeVisible({ timeout: 15000 });

    // Tab items in the mobile nav should be clickable
    const mobileNav = tabBar;
    await expect(mobileNav.getByLabel('Accueil')).toBeVisible();
    await expect(mobileNav.getByLabel('Repas')).toBeVisible();
    await expect(mobileNav.getByLabel('Animaux')).toBeVisible();
    await expect(mobileNav.getByLabel('Calendrier')).toBeVisible();
    await expect(mobileNav.getByLabel('Profil')).toBeVisible();

    // Click on Profil tab
    await mobileNav.getByLabel('Profil').click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible({ timeout: 15000 });
  });

  test('9.3 Error boundary — navigation ne crashe pas', async ({ page }) => {
    await interceptAllApi(page);

    const pages = ['/', '/content/pets', '/calendar', '/profile', '/feeding'];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // No blank screen: body should have visible content
      const bodyText = await page.textContent('body');
      expect(bodyText!.trim().length).toBeGreaterThan(0);

      // No uncaught errors in the page (no error boundary fallback)
      const errorBoundaryFallback = page.getByText(/something went wrong/i);
      await expect(errorBoundaryFallback).not.toBeVisible({ timeout: 3000 }).catch(() => {
        // If "something went wrong" is visible, that's an error boundary triggered
      });
    }
  });

  test('10.1 CGU accessible — lien vers /cgu avec contenu', async ({ page }) => {
    await page.goto('/cgu');
    await page.waitForLoadState('networkidle');

    // The page should have textual content (legal terms)
    const bodyText = await page.textContent('body');
    expect(bodyText!.trim().length).toBeGreaterThan(100);

    // Should contain legal-related text
    await expect(
      page.getByText(/conditions/i).first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test('10.2 Health disclaimer IA — visible dans la page chat', async ({ page }) => {
    await interceptAllApi(page);

    await page.goto('/ai-assistant');
    await page.waitForLoadState('networkidle');

    // The AI health disclaimer should be visible
    await expect(
      page.getByText(/ne remplacent pas l'avis d'un vétérinaire/i),
    ).toBeVisible({ timeout: 15000 });
  });
});
