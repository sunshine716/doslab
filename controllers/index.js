const indexHandler = require('./account/index');

module.exports = (req, res) => {
  indexHandler(req, res); // Forward  to the account login page
};
