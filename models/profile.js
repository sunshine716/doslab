
const db = require('../libs/dbClient')('DB');

const updateProfile = (updateFields, userId, callback) => {
  const wheres = { user_id: userId };
  db.update("profiles", updateFields, wheres, (err, updatedRowCount) => {
    if (err) {
      return callback(err);
    }
    return callback(null, updatedRowCount);
  });
};


module.exports = {
  updateProfile
};