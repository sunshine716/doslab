const logger = require('../../libs/logger');

const post = (req, res) => {
  logger.debug('Received request for account login');
  const { username, password } = req.body;

  console.log(`Login attempt with username: ${username}, password: ${password}`);
  // Save user info in session
  req.session.user = {
    username: username
    // Add more fields if needed
  };

  logger.info(`User ${username} logged in successfully`);

  res.render('dashboard', {
    user: 'Weiyang',
    layout: 'layout'
  });
};

module.exports = {
  post
};
