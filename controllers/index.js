const accountIndex = require('./account/index');

const get = (req, res) => {
  accountIndex.get(req, res); 
};

module.exports = { get };
