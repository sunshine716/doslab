const { countQuotesByUserId, findQuotesByUserIdPaged } = require('../../models/quotes');

let totalQuotesCache = {}; // Key: userId, Value: totalQuotes
const limit = 20; // Default limit for pagination

const get = async (req, res) => {

  const userId = req.session.user.userId;
  const currentPage = parseInt(req.query.page, 10) || 1;
  const offset = (currentPage - 1) * limit;

  // Per-user cache
  if (totalQuotesCache[userId] === undefined) {
    totalQuotesCache[userId] = await countQuotesByUserId(userId);
  }
  const totalPages = Math.ceil(totalQuotesCache[userId] / limit);
  const quotes = await findQuotesByUserIdPaged(userId, limit, offset);

  res.render('dashboard', {
    user: req.session.user.username,
    layout: 'layout',
    data: quotes,
    currentPage,
    totalPages,
    limit
  });
};

module.exports = { get };