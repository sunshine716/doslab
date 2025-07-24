const db = require('../libs/dbClient')('DB');
const authenticateUser = (username,pwd, callback) => {
  const sql = 'SELECT * FROM users WHERE username = $1 and password = $2';

  db.executeQuery(sql, [username, pwd], (err, data) => {
    if (err) {
      return callback(err);
    }
    return callback(null, data);
  });
};

module.exports = {
  authenticateUser
};