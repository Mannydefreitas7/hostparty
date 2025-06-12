/**
 * shared resources used by the nested integration tests
 */

import fs from 'fs';
import path from 'path';
import util from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface TestConfig {
  orig: string;
  path: string;
}

const config: TestConfig = {
  // source data
  orig: path.resolve(__dirname, './etc/hosts.test.orig'),
  // path to temp file
  path: path.resolve(__dirname, `./etc/hosts.${Math.floor(Math.random() * 100000)}.tmp`)
};

// Setup and teardown functions for tests
export const setupTestFile = (): void => {
  // copy source file
  fs.writeFileSync(config.path, fs.readFileSync(config.orig));
};

export const cleanupTestFile = async (): Promise<void> => {
  try {
    await fs.promises.unlink(config.path);
  } catch (e) {
    // ignore cleanup errors
  }
};

export default config;