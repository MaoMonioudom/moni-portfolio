const Service = require('../models/serviceModel');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private (Admin only)
const createService = async (req, res) => {
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

    const service = await Service.create({
      title,
      description,
      imageUrl,
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin only)
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    let imageUrl = req.body.imageUrl || service.imageUrl;

    if (req.file) {
      if (service.imageUrl) {
        // Delete old image
        await deleteImage(service.imageUrl);
      }
      imageUrl = req.file.path;
    }

    const updatedData = {
      ...req.body,
      imageUrl,
    };

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Admin only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    if (service.imageUrl) {
        await deleteImage(service.imageUrl);
    }
    
    await service.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
