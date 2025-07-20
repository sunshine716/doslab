const get = (req, res) => {
  res.render('main', {
    user: 'Weiyang',
    title: 'Welcome to the App',
    layout: 'layout'
  });
};

const post = (req, res) => {
  res.send('POST: Submit account update');
};

module.exports = {
  get,
  post
};