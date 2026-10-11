const User = require('../models/user');
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio: req.body.bio,
        location: req.body.location,
        github: req.body.github,
        linkedin: req.body.linkedin,
        skills: req.body.skills,
      },
      {
        new: true,
      }
    ).select('-password');
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(req.file);
    console.log(req.user);

    user.resume = req.file.path;

    await user.save();

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resume: user.resume,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { updateProfile, getProfile, uploadResume };
