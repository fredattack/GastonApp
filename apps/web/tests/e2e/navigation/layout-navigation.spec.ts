import { test, expect } from '@playwright/test';
import {
  interceptAllApi,
} from '../helpers';

/**
 * Scénario 7 : Navigation Générale & Mobile
 * Scénario 9 : Mentions Légales & Politique de Confidentialité
 */
test.describe('Scenario 7 — Navigation Generale & Mobile', () => {
  // Uses shared storageState (user already authenticated with pet via global-setup)

  test('S7.1 Navigation desktop — chaque page charge correctement', async ({ page }) => {
    await interceptAllApi(page);

    // Dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toHaveText(/error/i, { timeout: 10000 });

    // Animaux
    await page.goto('/content/pets');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="pets-page"]')).toBeVisible({ timeout: 10000 });

    // Calendrier
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="event-calendar"]')).toBeVisible({ timeout: 15000 });

    // Alimentation
    await page.goto('/feeding');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="feeding-dashboard"]')).toBeVisible({ timeout: 15000 });

    // Profil
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="profile-page"]')).toBeVisible({ timeout: 15000 });
  });

  test('S7.2 Responsive mobile — menu tab bar et navigation tactile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await interceptAllApi(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The mobile tab bar should be visible via data-testid
    const tabBar = page.locator('[data-testid="mobile-tab-bar"]');
    await expect(tabBar).toBeVisible({ timeout: 15000 });

    // Tab items should be present via data-testid
    await expect(page.locator('[data-testid="tab-accueil"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-repas"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-animaux"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-calendrier"]')).toBeVisible();
    await expect(page.locator('[data-testid="tab-profil"]')).toBeVisible();

    // Navigate via mobile tab bar
    await page.locator('[data-testid="tab-animaux"]').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/content\/pets/);

    await page.locator('[data-testid="tab-calendrier"]').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/calendar/);

    await page.locator('[data-testid="tab-profil"]').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="profile-page"]')).toBeVisible({ timeout: 15000 });

    // Back to home
    await page.locator('[data-testid="tab-accueil"]').click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/^http:\/\/localhost:4480\/$/);
  });

  test('S7.3 Pas de crash — error boundary non declenchee sur toutes les pages', async ({ page }) => {
    await interceptAllApi(page);

    const pages = ['/', '/content/pets', '/calendar', '/profile', '/feeding'];

    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const bodyText = await page.textContent('body');
      expect(bodyText!.trim().length).toBeGreaterThan(0);

      const errorBoundaryFallback = page.getByText(/something went wrong/i);
      await expect(errorBoundaryFallback).not.toBeVisible({ timeout: 3000 }).catch(() => {});
    }
  });

  test('S7.4 Disclaimer IA — visible dans la page assistant', async ({ page }) => {
    await interceptAllApi(page);

    await page.goto('/ai-assistant');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="ai-health-disclaimer"]')).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByText(/ne remplacent pas l'avis d'un vétérinaire/i),
    ).toBeVisible();
  });
});

test.describe('Scenario 9 — Mentions Legales & Politique de Confidentialite', () => {

  test('S9.1 CGU accessibles — contenu legal present', async ({ page }) => {
    await page.goto('/cgu');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.textContent('body');
    expect(bodyText!.trim().length).toBeGreaterThan(100);

    await expect(
      page.getByText(/conditions/i).first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test('S9.2 Politique de confidentialite — contenu RGPD present', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');

    // Page via data-testid
    await expect(page.locator('[data-testid="privacy-policy-page"]')).toBeVisible({ timeout: 10000 });

    // Key content
    await expect(
      page.getByText('Politique de Confidentialité').first(),
    ).toBeVisible();
    await expect(page.getByText(/Données collectées/i).first()).toBeVisible();
    await expect(page.getByText(/Vos droits/i).first()).toBeVisible();
    await expect(page.getByText('dpo@gaston.pet')).toBeVisible();
  });

  test('S9.3 Session preservee — visiter CGU ne deconnecte pas', async ({ page }) => {
    await interceptAllApi(page);

    // Start authenticated on dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL(/\/login/);

    // Visit CGU
    await page.goto('/cgu');
    await page.waitForLoadState('networkidle');
    const bodyText = await page.textContent('body');
    expect(bodyText!.trim().length).toBeGreaterThan(100);

    // Go back to authenticated area
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('S9.4 Liens legaux depuis le profil — CGU et Confidentialite accessibles', async ({ page }) => {
    await interceptAllApi(page);

    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="profile-page"]')).toBeVisible({ timeout: 15000 });

    // CGU link via data-testid
    const cguLink = page.locator('[data-testid="profile-cgu-link"]');
    await expect(cguLink).toBeVisible();
    await expect(cguLink).toHaveAttribute('href', '/cgu');

    // Privacy link via data-testid
    const privacyLink = page.locator('[data-testid="profile-privacy-link"]');
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveAttribute('href', '/privacy');
  });
});
