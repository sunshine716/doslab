const logger = require('../../libs/logger');
const {findCouponByCode} = require('../../models/coupon');

const get = (req, res) => {
  res.send('GET: TODO - Implement /coupon GET handler');
};

const post = (req, res) => {
  const code = req.body.couponCode;
  logger.info(`POST: Applying coupon code: ${code}`);

  if (!code) {
    return res.status(400).json({ message: 'Coupon code is required' });
  }

  // Validate coupon format using regex
  const couponRegex = /^SAVE(A|B+)+2025$/;
  if (!couponRegex.test(code)) {
    return res.status(400).json({
      message: 'Invalid coupon format. Please check the format and try again.'
    });
  }

  // Check if coupon exists in database
  findCouponByCode(code, (err, result) => {
    if(err) {
      logger.error(`Error finding coupon: ${err.message}`);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(400).json({
        message: 'This coupon does not exist. Please verify the coupon code..'
      });
    }

    const coupon = result[0];
    // Check if coupon is still valid
    if (!coupon.is_active) {
      return res.status(400).json({
        message: 'This coupon is no longer active.'
      });
    }

    // Check expiration date if set
    if (coupon.expiration_date) {
      const now = new Date();
      const expirationDate = new Date(coupon.expiration_date);
      if (now > expirationDate) {
        return res.status(400).json({
          message: 'This coupon has expired.'
        });
      }
    }

    // Apply coupon successfully
    return res.status(200).json({
      message: `Coupon applied successfully! You saved $${coupon.discount_amount}`,
      discount_amount: coupon.discount_amount,
      coupon_code: code
    });
  });
};

module.exports = {
  get,
  post
};