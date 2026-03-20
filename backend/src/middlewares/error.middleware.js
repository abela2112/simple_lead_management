const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: "Route not found" });
};
// Global error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
//return res.status(500).json({ message: "Internal server error" });

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
};

export {
  notFoundHandler,
  errorHandler,
};
