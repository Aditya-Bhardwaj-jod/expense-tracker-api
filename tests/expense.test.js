import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../src/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'expenses.json');

async function resetDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, '[]', 'utf-8');
}

const validExpense = {
  title: 'Grocery shopping',
  amount: 1500,
  category: 'Food',
  date: '2026-07-15',
};

describe('Expense Tracker API', () => {
  beforeEach(async () => {
    await resetDataFile();
  });

  afterAll(async () => {
    await resetDataFile();
  });

  describe('POST /expenses', () => {
    it('creates a new expense with a valid payload', async () => {
      const res = await request(app).post('/expenses').send(validExpense);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(validExpense.title);
      expect(res.body.data.amount).toBe(validExpense.amount);
    });

    it('rejects a payload missing required fields', async () => {
      const res = await request(app).post('/expenses').send({ title: 'Coffee' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects a completely empty payload', async () => {
      const res = await request(app).post('/expenses').send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects an invalid amount (zero or negative)', async () => {
      const res = await request(app)
        .post('/expenses')
        .send({ ...validExpense, amount: -50 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects an invalid date', async () => {
      const res = await request(app)
        .post('/expenses')
        .send({ ...validExpense, date: 'not-a-date' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects a title shorter than 3 characters', async () => {
      const res = await request(app)
        .post('/expenses')
        .send({ ...validExpense, title: 'AB' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /expenses', () => {
    it('returns an empty array when the data file is empty', async () => {
      const res = await request(app).get('/expenses');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('returns all expenses', async () => {
      await request(app).post('/expenses').send(validExpense);
      await request(app)
        .post('/expenses')
        .send({ ...validExpense, title: 'Bus fare', category: 'Transport', amount: 50 });

      const res = await request(app).get('/expenses');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('filters expenses by category', async () => {
      await request(app).post('/expenses').send(validExpense);
      await request(app)
        .post('/expenses')
        .send({ ...validExpense, title: 'Bus fare', category: 'Transport', amount: 50 });

      const res = await request(app).get('/expenses?category=Food');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].category).toBe('Food');
    });
  });

  describe('GET /expenses/summary', () => {
    it('returns total and count across all expenses', async () => {
      await request(app).post('/expenses').send(validExpense);
      await request(app)
        .post('/expenses')
        .send({ ...validExpense, title: 'Bus fare', category: 'Transport', amount: 50 });

      const res = await request(app).get('/expenses/summary');

      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(1550);
      expect(res.body.data.count).toBe(2);
    });

    it('returns the total for a specific category', async () => {
      await request(app).post('/expenses').send(validExpense);
      await request(app)
        .post('/expenses')
        .send({ ...validExpense, title: 'Snacks', category: 'Food', amount: 200 });

      const res = await request(app).get('/expenses/summary?category=Food');

      expect(res.status).toBe(200);
      expect(res.body.data.category).toBe('Food');
      expect(res.body.data.total).toBe(1700);
    });
  });

  describe('DELETE /expenses/:id', () => {
    it('deletes an existing expense', async () => {
      const createRes = await request(app).post('/expenses').send(validExpense);
      const { id } = createRes.body.data;

      const res = await request(app).delete(`/expenses/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(id);
    });

    it('returns 404 when deleting a non-existing expense', async () => {
      const res = await request(app).delete('/expenses/non-existent-id');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
