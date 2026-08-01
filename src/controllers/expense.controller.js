import * as expenseService from '../services/expense.service.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export async function createExpenseHandler(req, res, next) {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (err) {
    next(err);
  }
}

export async function getExpensesHandler(req, res, next) {
  try {
    const { category } = req.query;
    const expenses = await expenseService.getExpenses(category);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Expenses retrieved successfully',
      data: expenses,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSummaryHandler(req, res, next) {
  try {
    const { category } = req.query;
    const summary = await expenseService.getSummary(category);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Summary retrieved successfully',
      data: summary,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteExpenseHandler(req, res, next) {
  try {
    const { id } = req.params;
    const deletedExpense = await expenseService.deleteExpense(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Expense deleted successfully',
      data: deletedExpense,
    });
  } catch (err) {
    next(err);
  }
}
