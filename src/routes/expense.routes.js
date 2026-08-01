import { Router } from 'express';
import {
  createExpenseHandler,
  getExpensesHandler,
  getSummaryHandler,
  deleteExpenseHandler,
} from '../controllers/expense.controller.js';
import { validateExpense } from '../middlewares/validateExpense.js';

const router = Router();

/**
 * @openapi
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseInput'
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid payload
 */
router.post('/', validateExpense, createExpenseHandler);

/**
 * @openapi
 * /expenses:
 *   get:
 *     summary: Get all expenses, optionally filtered by category
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter expenses by category
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get('/', getExpensesHandler);

/**
 * @openapi
 * /expenses/summary:
 *   get:
 *     summary: Get total expenses, optionally filtered by category
 *     tags: [Expenses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: Summary of expenses
 */
router.get('/summary', getSummaryHandler);

/**
 * @openapi
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense by id
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete('/:id', deleteExpenseHandler);

export default router;
