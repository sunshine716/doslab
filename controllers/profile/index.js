const { updateProfile } = require('../../models/profile');

const get = (req, res) => {

  res.render('dashboard', {
    user: req.session.user.username,
    layout: 'layout',
    rightPage: 'profile'
  });
};

const post = (req, res) => {

  const { given_name, family_name, phone_number, country } = req.body;
  
  if (!given_name || !family_name) {
    return res.status(400).json({
      message: 'Given name and family name are required.'
    });
  }

  console.log(`req.session.user.id: ${req.session.user.id}`);

  updateProfile({
    given_name,
    family_name,
    phone_number,
    country
  }, req.session.user.userId, (err, updatedRowCount) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({
        message: 'An error occurred while updating the profile.'
      });
    }

    if (updatedRowCount === 0) {
      return res.status(400).json({
        message: 'Profile not found or no changes made.'
      });
    }
    
    console.log(`Profile updated successfully for user ${req.session.user.username}`);
    return res.status(200).json({
      message: `Profile updated successfully!`,
    });

  });
};

module.exports = {
  get,
  post
};