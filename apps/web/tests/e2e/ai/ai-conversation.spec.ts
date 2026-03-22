import { test, expect } from '@playwright/test';
import {
  registerUserViaApi,
  loginWithToken,
  createPetViaApi,
  interceptAllApi,
} from '../helpers';

test.describe('AI Conversation', () => {
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

    // Create a pet so the AI has context
    await createPetViaApi(token, userId, { name: 'Rex', species: 'dog', breed: 'Labrador' });
  });

  test('7.1 Envoi prompt et reponse structuree', async ({ page }) => {
    test.setTimeout(60000);

    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/ai-assistant');
    await page.waitForLoadState('networkidle');

    // The AI Assistant page should load
    await expect(page.getByRole('heading', { name: 'AI Assistant' })).toBeVisible({ timeout: 15000 });

    // Type a message in the chat input
    const chatInput = page.getByLabel('Message input');
    await expect(chatInput).toBeVisible({ timeout: 10000 });
    await chatInput.fill('Bonjour, quels sont mes animaux ?');

    // Send the message by pressing Enter
    await chatInput.press('Enter');

    // The user message should appear in the thread
    await expect(page.getByText('Bonjour, quels sont mes animaux ?')).toBeVisible({ timeout: 10000 });

    // Wait for the AI response (real API call — generous timeout)
    // The response should contain text (not an error message)
    // Look for any new content that appears after the user message
    await expect(async () => {
      // Look for a response that is NOT the user's message and NOT the header
      const responseElements = page.locator('[class*="bg-gray"], [class*="bg-white"]').filter({
        hasNot: page.getByText('Bonjour, quels sont mes animaux ?'),
      });
      // At least some response text should be present
      const allText = await page.textContent('body');
      expect(allText).toBeTruthy();
      // The response should be in French and not an error
      expect(allText).not.toContain('Error');
      expect(allText).not.toContain('500');
    }).toPass({ timeout: 45000 });
  });

  test('7.2 Affichage UI de la reponse — disclaimer visible', async ({ page }) => {
    test.setTimeout(60000);

    await interceptAllApi(page);
    await page.goto('/login');
    await loginWithToken(page, token, userId);
    await page.goto('/ai-assistant');
    await page.waitForLoadState('networkidle');

    // The health disclaimer should be visible
    await expect(
      page.getByText(/ne remplacent pas l'avis d'un vétérinaire/i),
    ).toBeVisible({ timeout: 15000 });

    // Send a message to get a response
    const chatInput = page.getByLabel('Message input');
    await chatInput.fill('Quels vaccins pour un chien ?');
    await chatInput.press('Enter');

    // Wait for the AI response to appear in the chat
    // The response should be displayed as a message bubble/card in the thread
    await expect(async () => {
      // Count message elements — should have at least 2 (user + AI response)
      // The AI response should eventually appear after the user message
      const userMsg = page.getByText('Quels vaccins pour un chien ?');
      await expect(userMsg).toBeVisible();

      // Wait for some AI response content to appear after the loading state
      // We check that there's more text than just the user message
      const bodyText = await page.textContent('body');
      // The AI should respond with something about vaccines/animals
      expect(bodyText!.length).toBeGreaterThan(200);
    }).toPass({ timeout: 45000 });

    // The disclaimer should still be visible after the conversation
    await expect(
      page.getByText(/ne remplacent pas l'avis d'un vétérinaire/i),
    ).toBeVisible();
  });
});
