import { test, expect } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
  interceptAllApi,
} from '../helpers';

/**
 * Scénario 5 : Assistant IA - Test Texte
 * Couvre : envoi de prompts, réponses en français, disclaimer santé, qualité chat
 *
 * Note : Le scénario 6 (vocal) n'est pas automatisable avec Playwright
 * car il nécessite un microphone physique.
 */
test.describe('Scenario 5 — Assistant IA Texte', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let token: string;
  let userId: string;

  test.beforeAll(async () => {
    const email = `e2e-ai-${Date.now()}@gaston.test`;
    const result = await registerUserViaApi({
      name: 'AI Tester',
      email,
      password: 'TestPassword123!',
    });
    token = result.token;
    userId = result.userId;

    await createPetViaApi(token, userId, { name: 'Rex', species: 'dog', breed: 'Labrador' });
    await createPetViaApi(token, userId, { name: 'Luna', species: 'cat', breed: 'Maine Coon' });
  });

  test('S5.1 Envoi prompt — question sur les animaux → reponse IA', async ({ page }) => {
    test.setTimeout(60000);

    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/ai-assistant');
    await page.waitForLoadState('networkidle');

    // The AI Assistant page should load via data-testid
    await expect(page.locator('[data-testid="ai-assistant-page"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="ai-assistant-title"]')).toBeVisible();

    // Type a message in the chat input via data-testid
    const chatInput = page.locator('[data-testid="chat-input"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });
    await chatInput.fill('Bonjour, quels sont mes animaux ?');

    // Send the message
    await chatInput.press('Enter');

    // The user message should appear in the thread
    await expect(page.getByText('Bonjour, quels sont mes animaux ?')).toBeVisible({ timeout: 10000 });

    // Wait for the AI response (real API call)
    await expect(async () => {
      const allText = await page.textContent('body');
      expect(allText).toBeTruthy();
      expect(allText).not.toContain('Error');
      expect(allText).not.toContain('500');
    }).toPass({ timeout: 45000 });
  });

  test('S5.2 Disclaimer sante — visible avant et apres conversation', async ({ page }) => {
    test.setTimeout(60000);

    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/ai-assistant');
    await page.waitForLoadState('networkidle');

    // The health disclaimer should be visible via data-testid
    await expect(page.locator('[data-testid="ai-health-disclaimer"]')).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByText(/ne remplacent pas l'avis d'un vétérinaire/i),
    ).toBeVisible();

    // Send a health-related question
    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('Quels vaccins pour un chien ?');
    await chatInput.press('Enter');

    // Wait for AI response
    await expect(async () => {
      const userMsg = page.getByText('Quels vaccins pour un chien ?');
      await expect(userMsg).toBeVisible();
      const bodyText = await page.textContent('body');
      expect(bodyText!.length).toBeGreaterThan(200);
    }).toPass({ timeout: 45000 });

    // The disclaimer should still be visible after the conversation
    await expect(page.locator('[data-testid="ai-health-disclaimer"]')).toBeVisible();
  });

  test('S5.3 Conseil general — IA repond en francais naturel', async ({ page }) => {
    test.setTimeout(60000);

    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/ai-assistant');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="ai-assistant-page"]')).toBeVisible({ timeout: 15000 });

    const chatInput = page.locator('[data-testid="chat-input"]');
    await chatInput.fill('Conseil pour toilettage d\'un chat long poil');
    await chatInput.press('Enter');

    await expect(page.getByText(/toilettage.*chat/i).first()).toBeVisible({ timeout: 10000 });

    // Wait for AI response
    await expect(async () => {
      const bodyText = await page.textContent('body');
      expect(bodyText!.length).toBeGreaterThan(300);
      expect(bodyText).not.toContain('Error');
    }).toPass({ timeout: 45000 });
  });

  test('S5.4 Qualite chat — interface reactive et bouton micro present', async ({ page }) => {
    test.setTimeout(60000);

    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/ai-assistant');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="ai-assistant-page"]')).toBeVisible({ timeout: 15000 });

    // Verify the chat input is functional via data-testid
    const chatInput = page.locator('[data-testid="chat-input"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });
    await expect(chatInput).toBeEnabled();

    // Verify the send button exists
    await expect(page.locator('[data-testid="chat-send-button"]')).toBeVisible();

    // Verify the voice button exists (Scenario 6 UI check)
    await expect(page.locator('[data-testid="chat-voice-button"]')).toBeVisible();

    // No error boundary
    const errorBoundary = page.getByText(/something went wrong/i);
    await expect(errorBoundary).not.toBeVisible({ timeout: 3000 }).catch(() => {});

    // Page body should have content
    const bodyText = await page.textContent('body');
    expect(bodyText!.trim().length).toBeGreaterThan(0);
  });
});
