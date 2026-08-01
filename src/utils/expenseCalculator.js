/**
 * Sums the amount of every expense in the list.
 */
export function calculateTotal(expenses) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Sums the amount of every expense whose category matches (case-insensitive).
 */
export function calculateTotalByCategory(expenses, category) {
  return expenses
    .filter((expense) => expense.category.toLowerCase() === category.toLowerCase())
    .reduce((sum, expense) => sum + expense.amount, 0);
}
