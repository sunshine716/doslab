/**
 * User logout handler
 * @param {*} req 
 * @param {*} res 
 */
const get = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = {
  get
};