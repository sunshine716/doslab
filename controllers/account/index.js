const get = (req, res) => {
  res.render('main', {
    message: ''
  });
};

module.exports = {
  get
};