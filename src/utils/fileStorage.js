import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '..', 'data', 'expenses.json');

/**
 * Makes sure the data file (and its parent directory) exists.
 * If it's missing, it gets created with an empty array as the seed content.
 */
async function ensureDataFileExists() {
  try {
    await fs.access(DATA_FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, '[]', 'utf-8');
  }
}

/**
 * Reads and parses the expenses data file.
 * An empty file is treated as an empty list. A malformed file throws
 * a 500-flagged error so the caller can surface a clean "server error"
 * instead of crashing the process.
 */
export async function readExpenses() {
  await ensureDataFileExists();
  const rawContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');

  if (!rawContent || rawContent.trim() === '') {
    return [];
  }

  try {
    const parsed = JSON.parse(rawContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const error = new Error('Expense data file is corrupted and could not be read.');
    error.statusCode = 500;
    throw error;
  }
}

/**
 * Persists the given expenses array to disk.
 * Writes to a temp file first and then renames it into place, so a crash
 * mid-write can never leave the real data file half-written or corrupted.
 */
export async function writeExpenses(expenses) {
  await ensureDataFileExists();
  const tempFilePath = `${DATA_FILE_PATH}.tmp`;
  await fs.writeFile(tempFilePath, JSON.stringify(expenses, null, 2), 'utf-8');
  await fs.rename(tempFilePath, DATA_FILE_PATH);
}
