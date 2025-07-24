const logger = require('../../libs/logger');
const { authenticateUser } = require('../../models/account');
const crypto = require('crypto');

const post = (req, res) => {
  const { username, password } = req.body;
  //hash password
  const hashedPassword = crypto.pbkdf2Sync(password, 'salt',
    1000000, 64, 'sha512').toString('hex');

  //The following code is vulnerable to DoS attack, becuase it does not check the err parameter before accssing to data object
  authenticateUser(username, hashedPassword, (err, data) => {
    if (data.length === 0) {
      return res.render('main', {
        message: 'Invalid username or password!'
      });
    }
    logger.info(`User ${username} logged in successfully`);

    const userId = 4; // This should be fetched from the database based on the username
    req.session.user = { username, userId };
    res.redirect('/quotes');
  });

};

module.exports = { post };
