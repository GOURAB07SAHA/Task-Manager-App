const User = require('../models/User');
const Team = require('../models/Team');
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('cloudinary').v2;

// @desc    Get full user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('teamMemberships.teamId', 'name description avatar')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'profile.firstName',
      'profile.lastName',
      'profile.bio',
      'profile.jobTitle',
      'profile.department',
      'profile.phone',
      'profile.location',
      'profile.timezone',
      'profile.dateOfBirth',
      'profile.socialLinks',
      'preferences',
      'skills'
    ];

    const updateData = {};
    
    // Only include allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) || key.startsWith('profile.') || key.startsWith('preferences.')) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile avatar
// @route   POST /api/users/profile/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    upload.single('avatar')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image file'
        });
      }

      const user = await User.findById(req.user.id);

      // Delete old avatar from Cloudinary if exists
      if (user.profile.avatar.publicId) {
        await cloudinary.uploader.destroy(user.profile.avatar.publicId);
      }

      // Update user with new avatar
      user.profile.avatar.url = req.file.path;
      user.profile.avatar.publicId = req.file.filename;
      await user.save();

      res.status(200).json({
        success: true,
        data: {
          avatar: {
            url: user.profile.avatar.url,
            publicId: user.profile.avatar.publicId
          }
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete profile avatar
// @route   DELETE /api/users/profile/avatar
// @access  Private
const deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.profile.avatar.publicId) {
      await cloudinary.uploader.destroy(user.profile.avatar.publicId);
    }

    user.profile.avatar.url = '';
    user.profile.avatar.publicId = '';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add work experience
// @route   POST /api/users/profile/work-history
// @access  Private
const addWorkHistory = async (req, res, next) => {
  try {
    const { title, company, startDate, endDate, description, isCurrent } = req.body;

    const user = await User.findById(req.user.id);

    user.workHistory.push({
      title,
      company,
      startDate,
      endDate: isCurrent ? null : endDate,
      description,
      isCurrent
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: user.workHistory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update work experience
// @route   PUT /api/users/profile/work-history/:id
// @access  Private
const updateWorkHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const workItem = user.workHistory.id(req.params.id);

    if (!workItem) {
      return res.status(404).json({
        success: false,
        message: 'Work history item not found'
      });
    }

    Object.assign(workItem, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      data: workItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete work experience
// @route   DELETE /api/users/profile/work-history/:id
// @access  Private
const deleteWorkHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.workHistory.pull({ _id: req.params.id });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Work history deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add skill
// @route   POST /api/users/profile/skills
// @access  Private
const addSkill = async (req, res, next) => {
  try {
    const { name, level } = req.body;

    const user = await User.findById(req.user.id);

    // Check if skill already exists
    const existingSkill = user.skills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists'
      });
    }

    user.skills.push({ name, level });
    await user.save();

    res.status(201).json({
      success: true,
      data: user.skills
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/users/profile/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const skill = user.skills.id(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    Object.assign(skill, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/users/profile/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.skills.pull({ _id: req.params.id });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/profile/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's teams count
    const teamsCount = await Team.countDocuments({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    });

    // Get user's tasks count (this would need the Task model to be imported)
    // For now, we'll return basic stats
    const stats = {
      teamsCount,
      profileCompletion: calculateProfileCompletion(await User.findById(userId)),
      memberSince: (await User.findById(userId)).createdAt
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  const fields = [
    user.name,
    user.profile.firstName,
    user.profile.lastName,
    user.profile.bio,
    user.profile.jobTitle,
    user.profile.phone,
    user.profile.location,
    user.profile.avatar.url,
    user.skills.length > 0,
    user.workHistory.length > 0
  ];

  const completedFields = fields.filter(field => field && field !== '').length;
  return Math.round((completedFields / fields.length) * 100);
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  addWorkHistory,
  updateWorkHistory,
  deleteWorkHistory,
  addSkill,
  updateSkill,
  deleteSkill,
  getUserStats
};
