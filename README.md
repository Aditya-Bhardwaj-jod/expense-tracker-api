 # Smart Expense Tracker API

A REST API for tracking personal expenses, built with Node.js and Express. Data is persisted to a local JSON file — no database required.

## Features

- Add an expense (`title`, `amount`, `category`, `date`)
- View all expenses
- Filter expenses by category
- Get total expenses (overall, or scoped to a category)
- Delete an expense
- Input validation with descriptive error messages
- Centralized error handling with a consistent response shape
- Interactive API documentation via Swagger UI

## Architecture 

The project follows a layered, separation-of-concerns structure:

- **Routes** — define endpoints only, no logicV
- **Controllers** — receive the request, call the service layer, shape the response
- **Services** — business logic (validation of business rules, calculations, orchestrating storage)
- **Utils** — reusable helpers (file storage, calculations)
- **Middlewares** — request validation and centralized error handling

## Folder Structure

```
expense-tracker/
├── README.md
├── AI_NOTES.md
├── package.json
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── swagger.js
│   ├── routes/
│   │   └── expense.routes.js
│   ├── controllers/
│   │   └── expense.controller.js
│   ├── services/
│   │   └── expense.service.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── validateExpense.js
│   ├── utils/
│   │   ├── fileStorage.js
│   │   └── expenseCalculator.js
│   ├── constants/
│   │   └── httpStatus.js
│   └── data/
│       └── expenses.json
└── tests/
    └── expense.test.js
```

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

The server starts on `http://localhost:3000` by default (override with the `PORT` environment variable).

## Development

```bash
npm run dev
```

Runs the server with `nodemon` for automatic restarts on file changes.

## Testing

```bash
npm test
```

Runs the Jest + Supertest suite, covering creation, validation, filtering, summaries, and deletion (including edge cases like invalid payloads and deleting a non-existing expense).

## API Documentation

Once the server is running, interactive Swagger docs are available at:

```
http://localhost:3000/api-docs
```

## API Endpoints

| Method | Endpoint                          | Description                              |
|--------|------------------------------------|-------------------------------------------|
| POST   | `/expenses`                        | Create a new expense                     |
| GET    | `/expenses`                        | Get all expenses                         |
| GET    | `/expenses?category=Food`          | Get expenses filtered by category        |
| GET    | `/expenses/summary`                | Get total amount and count               |
| GET    | `/expenses/summary?category=Food`  | Get total amount for a specific category |
| DELETE | `/expenses/:id`                    | Delete an expense by id                  |

## Sample Requests & Responses

### Create an expense

```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Grocery shopping","amount":1500,"category":"Food","date":"2026-07-15"}'
```

```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "id": "a5f21f12-da0f-4806-9a48-c4d881ed899d",
    "title": "Grocery shopping",
    "amount": 1500,
    "category": "Food",
    "date": "2026-07-15"
  }
}
```

### Get all expenses

```bash
curl http://localhost:3000/expenses
```

### Filter by category

```bash
curl http://localhost:3000/expenses?category=Food
```

### Get overall summary

```bash
curl http://localhost:3000/expenses/summary
```

```json
{
  "success": true,
  "message": "Summary retrieved successfully",
  "data": { "total": 1500, "count": 1 }
}
```

### Get summary for a category

```bash
curl http://localhost:3000/expenses/summary?category=Food
```

```json
{
  "success": true,
  "message": "Summary retrieved successfully",
  "data": { "category": "Food", "total": 1500 }
}
```

### Delete an expense

```bash
curl -X DELETE http://localhost:3000/expenses/a5f21f12-da0f-4806-9a48-c4d881ed899d
```

### Validation error example

```json
{
  "success": false,
  "message": "title is required and must be a non-empty string; amount is required and must be a number"
}
```

## Assumptions

- Category matching (filtering and summaries) is case-insensitive.
- `date` accepts either a plain ISO date (`2026-07-15`) or a full ISO timestamp.
- The data file is treated as the single source of truth; it's read fresh before every operation and rewritten (atomically, via a temp file + rename) after every change.
- No authentication/authorization was required by the assignment, so none is implemented.

## Tech Stack

- Node.js / Express.js
- JavaScript (ES Modules)
- JSON file storage (`fs/promises`)
- Jest + Supertest for testing
- Swagger (`swagger-jsdoc` + `swagger-ui-express`) for API docs
- Helmet, Compression, Morgan for security/performance/logging

## Future Improvements

- Pagination for `GET /expenses` once the dataset grows
- Editing an existing expense (`PATCH /expenses/:id`)
- Swap the JSON file for a real database if concurrent writes become a concern
- Stricter date-range validation (e.g. rejecting overflow dates like `2026-02-30`)
