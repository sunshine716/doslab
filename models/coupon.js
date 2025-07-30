const db = require('../libs/dbClient')('DB');
/**
 * Finds a coupon by its code
 * @param {string} code - Coupon code
 * @returns {Promise<Object|null>} Coupon object or null if not found
 */
const findCouponByCode = (code, callback) => {
  const sql = 'SELECT * FROM coupons where code = $1';

  db.executeQuery(sql, [code], (err, data) => {
    if (err) {
      return callback(err);
    }
    return callback(null, data);
  });
};


module.exports = {
  findCouponByCode
};
