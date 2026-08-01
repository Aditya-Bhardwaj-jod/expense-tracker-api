/**
 * Custom error class for known, "expected" failures (bad input, missing
 * resource, etc.) so the handler below knows which status code to use
 * instead of always falling back to 500.
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

/**
 * Catches requests that don't match any route.
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

/**
 * Single place where every error in the app ends up. Keeps the response
 * shape consistent no matter where the error came from.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode === 500) {
    // Unexpected errors are worth logging server-side even though we
    // don't leak internal details to the client.
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}
