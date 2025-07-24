const logger = require('../libs/logger');

// errorHandler.js (optional separate file)
function errorHandler(err, req, res, _next) {
  logger.error('Unhandled error:', err.stack || err);

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
}

module.exports = errorHandler;
