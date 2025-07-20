const get = (req, res) => {
  res.send('GET: Update account info');
};

const post = (req, res) => {
  res.send('POST: Submit account update');
};

module.exports = {
  get,
  post
};