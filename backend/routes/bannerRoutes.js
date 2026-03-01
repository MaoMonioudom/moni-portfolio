const express = require('express');
const router = express.Router();
const {
  getBanners,
  getAllBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  reorderBanners,
} = require('../controllers/bannerController');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getBanners);
router.get('/all', getAllBanners);
router.get('/:id', getBanner);

// Admin routes
router.post('/', upload.single('image'), createBanner);
router.put('/reorder', reorderBanners);
router.put('/:id', upload.single('image'), updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
