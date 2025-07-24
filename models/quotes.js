const db = require('../libs/dbClient')('DB');

/**
 * Finds quotes for a user, paginated.
 * @param {number} userId - User's id
 * @param {number} limit - Page size
 * @param {number} offset - Offset
 * @returns {Promise<Array>} Quotes for the page
 */
const findQuotesByUserIdPaged = (userId, limit, offset) => {
  const sql = 'SELECT * FROM quotes WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3';
  return db.executeQueryAsync(sql, [userId, limit, offset]);
};

/**
 * Counts all quotes for a user.
 * @param {number} userId
 * @returns {Promise<number>} Total count
 */
const countQuotesByUserId = async (userId) => {
  const sql = 'SELECT COUNT(*) FROM quotes WHERE user_id = $1';
  const rows = await db.executeQueryAsync(sql, [userId]);
  return parseInt(rows[0].count);
};


module.exports = {
  countQuotesByUserId,      // callback-based
  findQuotesByUserIdPaged // Promise-based
};
