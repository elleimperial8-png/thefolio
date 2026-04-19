// backend/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// REGISTER
router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email is already registered' });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(400).json({ message: 'Invalid email or password' });

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET ME
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// ✅ UPDATE PROFILE (FIXED FIELD NAME)
router.put(
  '/profile',
  protect,
  upload.single('profilePicture'), // ✅ MATCH FRONTEND
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      if (req.body.name) user.name = req.body.name;
      if (req.body.bio) user.bio = req.body.bio;

      if (req.file) {
        user.profilePic = req.file.filename; // store filename
      }

      await user.save();

      const updated = await User.findById(user._id).select('-password');
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// CHANGE PASSWORD
router.put('/change-password', protect, async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const match = await user.matchPassword(currentPassword);
    if (!match)
      return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;