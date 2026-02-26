const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { upload } = require('../config/cloudinary');

router.get('/', getServices);
router.post('/', upload.single('image'), createService);
router.put('/:id', upload.single('image'), updateService);
router.delete('/:id', deleteService);

module.exports = router;
