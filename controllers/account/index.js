module.exports = (req, res) => {
  res.render('main', {
    user: 'Weiyang',
    title: 'Welcome to the App',
    layout: 'layout'
  });
};
