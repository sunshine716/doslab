module.exports = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.userId) {
    // Authenticated, proceed to next middleware/route
    return next();
  }
  // Not logged in: redirect to login page
  res.redirect('/');
};