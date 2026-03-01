const express = require('express');
const router = express.Router();
const {
  getFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
} = require('../controllers/featureController');
const { upload } = require('../config/cloudinary');

router.get('/', getFeatures);
router.get('/:id', getFeature);
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'moreImages', maxCount: 10 },
  ]),
  createFeature
);
router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'moreImages', maxCount: 10 },
  ]),
  updateFeature
);
router.delete('/:id', deleteFeature);

module.exports = router;
