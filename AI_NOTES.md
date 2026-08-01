# AI Usage Notes

## Which parts were AI-assisted

I used Claude to scaffold and generate the initial implementation of this project:

- Project structure (routes / controllers / services / middlewares / utils / constants)
- Core CRUD logic: `expense.service.js`, `expense.controller.js`, `expense.routes.js`
- File-based persistence in `fileStorage.js` (read/write to `src/data/expenses.json`, including creating the file if it's missing, treating an empty file as `[]`, and writing via a temp file + rename so the JSON file can't end up half-written)
- Validation middleware (`validateExpense.js`) for title/amount/category/date
- Centralized error handling (`errorHandler.js`)
- The Jest + Supertest test suite (`tests/expense.test.js`)
- Swagger/OpenAPI setup (`swagger.js`, JSDoc annotations on the routes) for the bonus feature
- The initial `README.md` draft

## What I validated / tested

- Ran `npm install` and `npm test` myself on a clean checkout — all 13 tests pass.
- Started the server with `npm start` and manually exercised every endpoint through the Swagger UI at `/api-docs`: created multiple expenses, listed them, checked the overall summary, and checked category filtering.
- Verified the math: created 3 expenses of ₹1200 each and confirmed `GET /expenses/summary` returned `total: 3600, count: 3`.
- Read through `validateExpense.js` and `expense.service.js` line by line to understand the validation rules and business logic before trusting them.
- While manually testing, I noticed the `category` field is stored as free text with no predefined list — if you type `"Food,Milk"` as the category, the API stores it as-is, and it won't match a filter like `?category=Food` since matching is exact (case-insensitive, but not partial). This isn't a bug — the assignment didn't ask for enum/predefined categories — but it's a real limitation I found by testing, not something I was told about.

## What I changed

- The generated `package.json` test script originally called `node --experimental-vm-modules node_modules/.bin/jest --runInBand`. On my Windows machine this failed with a `SyntaxError: missing ) after argument list`, because `.bin/jest` is a Unix shell script and Windows can't execute it directly with `node`. I traced the error, identified the cause, and changed the script to point at the actual JS entry point instead: `node_modules/jest/bin/jest.js`. After this fix, `npm test` ran cleanly on Windows (13/13 passing).

## An AI suggestion I didn't use as-is

The AI-generated `package.json` test script (`node_modules/.bin/jest`) worked on the AI's own Linux test run but is not portable — it's a Unix shell script and fails on Windows. Rather than accept it as final, I ran it myself on my actual machine (Windows), hit the failure, and had it corrected to use the cross-platform-safe path (`node_modules/jest/bin/jest.js`). This is the main example in this project of AI output that looked correct but needed a real environment to catch the issue — I didn't just trust that "tests passed once" meant the script was good everywhere.
