const logger = require('../libs/logger');

module.exports = (req, res, next) => {
  logger.debug(`Receied ${req.method} request for ${req.url} `);  
  next();
};