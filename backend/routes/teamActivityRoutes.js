const express = require('express');
const router = express.Router();
const {
  getTeamActivities,
  getTeamActivity,
  createTeamActivity,
  updateTeamActivity,
  deleteTeamActivity,
} = require('../controllers/teamActivityController');
const { upload } = require('../config/cloudinary');

router.get('/', getTeamActivities);
router.get('/:id', getTeamActivity);
router.post('/', upload.single('image'), createTeamActivity);
router.put('/:id', upload.single('image'), updateTeamActivity);
router.delete('/:id', deleteTeamActivity);

module.exports = router;
