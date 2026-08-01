import { v4 as uuidv4 } from 'uuid';
import { readExpenses, writeExpenses } from '../utils/fileStorage.js';
import { calculateTotal, calculateTotalByCategory } from '../utils/expenseCalculator.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Creates a new expense and persists it.
 */
export async function createExpense({ title, amount, category, date }) {
  const expenses = await readExpenses();

  const newExpense = {
    id: uuidv4(),
    title,
    amount,
    category,
    date,
  };

  expenses.push(newExpense);
  await writeExpenses(expenses);

  return newExpense;
}

/**
 * Returns all expenses, optionally filtered by category.
 */
export async function getExpenses(category) {
  const expenses = await readExpenses();

  if (!category) {
    return expenses;
  }

  return expenses.filter(
    (expense) => expense.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Returns either an overall summary (total + count) or, when a category
 * is provided, the total for just that category.
 */
export async function getSummary(category) {
  const expenses = await readExpenses();

  if (category) {
    return {
      category,
      total: calculateTotalByCategory(expenses, category),
    };
  }

  return {
    total: calculateTotal(expenses),
    count: expenses.length,
  };
}

/**
 * Deletes an expense by id. Throws a 404 AppError if it doesn't exist.
 */
export async function deleteExpense(id) {
  const expenses = await readExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === id);

  if (expenseIndex === -1) {
    throw new AppError(`Expense with id "${id}" not found`, 404);
  }

  const [deletedExpense] = expenses.splice(expenseIndex, 1);
  await writeExpenses(expenses);

  return deletedExpense;
}
