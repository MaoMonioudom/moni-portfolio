const jwt = require('jsonwebtoken');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password });
    console.log('Expected:', { adminEmail: process.env.ADMIN_EMAIL, adminPassword: process.env.ADMIN_PASSWORD });

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check against env credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Trim whitespace from both input and env values
    if (email.trim() === adminEmail?.trim() && password === adminPassword?.trim()) {
      // Generate JWT token
      const token = jwt.sign(
        { email: adminEmail, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          email: adminEmail,
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { loginAdmin, verifyToken };
