const TeamActivity = require('../models/teamActivityModel');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all team activities
// @route   GET /api/team-activities
// @access  Public
const getTeamActivities = async (req, res) => {
  try {
    const activities = await TeamActivity.find().sort({ createdAt: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single team activity
// @route   GET /api/team-activities/:id
// @access  Public
const getTeamActivity = async (req, res) => {
  try {
    const activity = await TeamActivity.findById(req.params.id);
    if (!activity) {
      res.status(404);
      throw new Error('Team activity not found');
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a team activity
// @route   POST /api/team-activities
// @access  Private (Admin only)
const createTeamActivity = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!title || !description) {
      res.status(400);
      throw new Error('Please add title and description');
    }

    const activity = await TeamActivity.create({
      title,
      description,
      imageUrl,
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a team activity
// @route   PUT /api/team-activities/:id
// @access  Private (Admin only)
const updateTeamActivity = async (req, res) => {
  try {
    const activity = await TeamActivity.findById(req.params.id);

    if (!activity) {
      res.status(404);
      throw new Error('Team activity not found');
    }

    let imageUrl = req.body.imageUrl || activity.imageUrl;

    if (req.file) {
      if (activity.imageUrl) {
        // Delete old image
        await deleteImage(activity.imageUrl);
      }
      imageUrl = req.file.path;
    }

    const updatedData = {
      ...req.body,
      imageUrl,
    };

    const updatedActivity = await TeamActivity.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a team activity
// @route   DELETE /api/team-activities/:id
// @access  Private (Admin only)
const deleteTeamActivity = async (req, res) => {
  try {
    const activity = await TeamActivity.findById(req.params.id);

    if (!activity) {
      res.status(404);
      throw new Error('Team activity not found');
    }

    if (activity.imageUrl) {
      await deleteImage(activity.imageUrl);
    }

    await activity.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTeamActivities,
  getTeamActivity,
  createTeamActivity,
  updateTeamActivity,
  deleteTeamActivity,
};
