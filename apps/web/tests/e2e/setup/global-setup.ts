import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:3008/api/v1-0-0';
const CREDENTIALS_FILE = path.join(__dirname, '../.auth/credentials.json');

export interface TestCredentials {
  email: string;
  password: string;
  name: string;
  token: string;
  userId: string;
}

async function globalSetup(config: FullConfig) {
  const testUser = {
    name: 'E2E Test User',
    email: `e2e-test-${Date.now()}@gaston.test`,
    password: 'TestPassword123!',
  };

  // Register test user via API
  const registerResponse = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      password_confirmation: testUser.password,
    }),
  });

  if (!registerResponse.ok) {
    const errorBody = await registerResponse.text();
    throw new Error(`Failed to register test user: ${registerResponse.status} ${errorBody}`);
  }

  const registerData = await registerResponse.json();
  const token = registerData.data?.token || registerData.token;
  const userId = String(registerData.data?.user?.id || registerData.user?.id);

  // Create a test pet so dashboard loads properly
  const petResponse = await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Rex E2E',
      species: 'dog',
      breed: 'Labrador',
      birthDate: '2020-01-15',
      isActive: true,
      ownerId: userId,
      order: 0,
      created_at: new Date().toISOString(),
    }),
  });

  if (!petResponse.ok) {
    console.warn(`Warning: Failed to create test pet: ${petResponse.status}`);
  }

  // Save credentials to file for test workers to read
  const credentials: TestCredentials = {
    email: testUser.email,
    password: testUser.password,
    name: testUser.name,
    token,
    userId,
  };

  fs.mkdirSync(path.dirname(CREDENTIALS_FILE), { recursive: true });
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));

  console.log(`[E2E Setup] Test user created: ${testUser.email}`);
}

export default globalSetup;
