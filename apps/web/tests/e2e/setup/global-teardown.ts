import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const credentialsFile = path.join(__dirname, '../.auth/credentials.json');

async function globalTeardown(config: FullConfig) {
  if (fs.existsSync(credentialsFile)) {
    const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf-8'));
    console.log(`[E2E Teardown] Test user: ${credentials.email}`);
    // Cleanup credentials file
    fs.unlinkSync(credentialsFile);
  }
  console.log('[E2E Teardown] Test session ended.');
}

export default globalTeardown;
