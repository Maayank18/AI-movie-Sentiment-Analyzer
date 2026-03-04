/**
 * 404 Middleware
 * Catches requests to any undefined route.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global Error Handler Middleware
 *
 * Centralises all error responses so every error shape
 * looks identical on the client side.
 *
 * Never expose stack traces in production.
 */
export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === "development";

  console.error(`❌  [${statusCode}] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only include stack trace during local development
    ...(isDevelopment && { stack: err.stack }),
  });
};