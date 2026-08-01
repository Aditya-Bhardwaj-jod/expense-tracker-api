import { AppError } from './errorHandler.js';

// Accepts plain dates (2026-07-15) and full ISO timestamps (2026-07-15T10:00:00Z).
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

/**
 * Validates the body of a "create expense" request.
 * Collects every problem found (rather than stopping at the first one)
 * so the client gets a complete list of what to fix in one response.
 */
export function validateExpense(req, res, next) {
  const { title, amount, category, date } = req.body;
  const errors = [];

  if (typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a non-empty string');
  } else if (title.trim().length < 3) {
    errors.push('title must be at least 3 characters long');
  }

  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    errors.push('amount is required and must be a number');
  } else if (amount <= 0) {
    errors.push('amount must be greater than 0');
  }

  if (typeof category !== 'string' || category.trim().length === 0) {
    errors.push('category is required and must be a non-empty string');
  }

  if (typeof date !== 'string' || date.trim().length === 0) {
    errors.push('date is required');
  } else if (Number.isNaN(Date.parse(date)) || !ISO_DATE_REGEX.test(date.trim())) {
    errors.push('date must be a valid ISO date string (e.g. 2026-07-15)');
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join('; '), 400));
  }

  // Normalize whitespace now that we know the fields are valid strings.
  req.body.title = title.trim();
  req.body.category = category.trim();

  next();
}
