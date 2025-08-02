const express = require('express');
const {
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
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/profile/avatar')
  .post(uploadAvatar)
  .delete(deleteAvatar);

router.route('/profile/work-history')
  .post(addWorkHistory);

router.route('/profile/work-history/:id')
  .put(updateWorkHistory)
  .delete(deleteWorkHistory);

router.route('/profile/skills')
  .post(addSkill);

router.route('/profile/skills/:id')
  .put(updateSkill)
  .delete(deleteSkill);

router.route('/profile/stats')
  .get(getUserStats);

module.exports = router;
