
const logger = require('../libs/logger');

function notFoundHandler(req, res, _next) {
  logger.error(`404 Not Found: ${req.originalUrl}`);
  
  res.render('404', {
    notFoundUrl: `${req.originalUrl}`
  });
}

module.exports = notFoundHandler;
