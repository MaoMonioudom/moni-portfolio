const express = require('express');
const router = express.Router();
const {
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} = require('../controllers/featureController');
const { upload } = require('../config/cloudinary');

router.get('/', getFeatures);
router.post('/', upload.single('image'), createFeature);
router.put('/:id', upload.single('image'), updateFeature);
router.delete('/:id', deleteFeature);

module.exports = router;
