const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    const message = err.message ? err.message : err?.msg || "Internal server error"
  
    res.status(statusCode);
  
    res.json({
      message: message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  module.exports = {
    errorHandler,
  };
  