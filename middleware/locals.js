module.exports = (req, res, next) => {
  res.locals.req = req;
  next();
};