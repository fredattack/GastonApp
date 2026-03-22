import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { TestCredentials } from './setup/global-setup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:3008/api/v1-0-0';
const CREDENTIALS_FILE = path.join(__dirname, '.auth/credentials.json');

/**
 * Read test credentials saved by global-setup
 */
export function getTestCredentials(): TestCredentials {
  return JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
}

/**
 * Route API calls through Vite proxy to avoid CSRF issues.
 * The app uses http://localhost:3008/api/... directly (cross-origin),
 * but the Vite dev server proxies /api → localhost:3008 (same-origin).
 */
export async function setupApiProxy(page: Page) {
  await page.route('http://localhost:3008/api/**', async (route) => {
    const url = new URL(route.request().url());
    const proxyUrl = `http://localhost:4480${url.pathname}${url.search}`;
    try {
      const response = await route.fetch({ url: proxyUrl });
      await route.fulfill({ response });
    } catch (error) {
      await route.continue();
    }
  });
}

/**
 * Login a user by injecting token into localStorage
 */
export async function loginWithToken(
  page: Page,
  token: string,
  userId: string,
) {
  await page.evaluate(
    ({ token, userId }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user_id', userId);
    },
    { token, userId },
  );
}

/**
 * Register a new user via API (Node-side, bypasses CSRF)
 */
export async function registerUserViaApi(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<{ token: string; userId: string }> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Register failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  const token = data.data?.token || data.token;
  const userId = String(data.data?.user?.id || data.user?.id);
  return { token, userId };
}

/**
 * Create a pet via API (Node-side, with Accept: application/json)
 */
export async function createPetViaApi(
  token: string,
  userId: string,
  petData: { name: string; species: string; breed?: string },
): Promise<string> {
  const response = await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: petData.name,
      species: petData.species,
      breed: petData.breed || 'Mixed',
      birth_date: '2020-01-15',
      is_active: true,
      owner_id: userId,
      gender: 'male',
      order: 0,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.warn(`Create pet failed: ${response.status} — ${body.substring(0, 200)}`);
    return '';
  }

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.id || data.data?.id || '';
  } catch {
    console.warn(`Create pet: unexpected response — ${text.substring(0, 200)}`);
    return '';
  }
}

/**
 * Intercept all API calls to the backend and relay via Node.js fetch.
 * Adds Accept: application/json (required by Laravel) and bypasses CSRF.
 */
export async function interceptAllApi(page: Page) {
  await page.route('http://localhost:3008/api/**', async (route) => {
    const req = route.request();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const authHeader = req.headers()['authorization'];
    if (authHeader) headers['Authorization'] = authHeader;

    const fetchOptions: RequestInit = {
      method: req.method(),
      headers,
    };
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method())) {
      const body = req.postData();
      if (body) fetchOptions.body = body;
    }

    try {
      const response = await fetch(req.url(), fetchOptions);
      const body = await response.text();
      await route.fulfill({
        status: response.status,
        contentType: 'application/json',
        body,
      });
    } catch {
      await route.continue();
    }
  });
}
