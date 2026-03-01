const express = require('express');
const router = express.Router();
const { loginAdmin, verifyToken } = require('../controllers/authController');

router.post('/login', loginAdmin);
router.get('/verify', verifyToken);

module.exports = router;
