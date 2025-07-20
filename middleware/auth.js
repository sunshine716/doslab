module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); // user is authenticated
  }

  res.status(401).json({ error: 'Unauthorized: Please log in' });
};