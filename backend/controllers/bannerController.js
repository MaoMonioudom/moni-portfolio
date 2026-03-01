const Banner = require('../models/bannerModel');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all banners (including inactive) for admin
// @route   GET /api/banners/all
// @access  Private (Admin)
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public
const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      res.status(404);
      throw new Error('Banner not found');
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private (Admin only)
const createBanner = async (req, res) => {
  try {
    const { title, subtitle, order, isActive } = req.body;
    let imageUrl = req.body.imageUrl;

    // Handle image upload
    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!title) {
      res.status(400);
      throw new Error('Please add a title');
    }

    if (!imageUrl) {
      res.status(400);
      throw new Error('Please add an image');
    }

    const banner = await Banner.create({
      title,
      subtitle: subtitle || '',
      imageUrl,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private (Admin only)
const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error('Banner not found');
    }

    let imageUrl = req.body.imageUrl || banner.imageUrl;

    // Update image if new one is uploaded
    if (req.file) {
      if (banner.imageUrl) {
        // Delete old image
        await deleteImage(banner.imageUrl);
      }
      imageUrl = req.file.path;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || banner.title,
        subtitle: req.body.subtitle !== undefined ? req.body.subtitle : banner.subtitle,
        imageUrl,
        order: req.body.order !== undefined ? req.body.order : banner.order,
        isActive: req.body.isActive !== undefined ? req.body.isActive : banner.isActive,
      },
      { new: true }
    );

    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private (Admin only)
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      res.status(404);
      throw new Error('Banner not found');
    }

    // Delete image from Cloudinary
    if (banner.imageUrl) {
      await deleteImage(banner.imageUrl);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reorder banners
// @route   PUT /api/banners/reorder
// @access  Private (Admin only)
const reorderBanners = async (req, res) => {
  try {
    const { bannerOrders } = req.body; // Array of { id, order }

    if (!bannerOrders || !Array.isArray(bannerOrders)) {
      res.status(400);
      throw new Error('Please provide banner orders');
    }

    const updatePromises = bannerOrders.map(({ id, order }) =>
      Banner.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    const banners = await Banner.find().sort({ order: 1 });
    
    res.status(200).json(banners);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getBanners,
  getAllBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
};
