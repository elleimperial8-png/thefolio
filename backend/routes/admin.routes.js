const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

const router = express.Router();

// All routes below require: (1) valid token AND (2) admin role
router.use(protect, adminOnly);

//
// ── GET /api/admin/members — List all non-admin members
//
router.get('/members', async (req, res) => {
  try {
    const members = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// ── GET /api/admin/users — Backward compatibility
//
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// ── PUT /api/admin/members/:id — Activate / Deactivate member (FIXED)
// Uses: status = 'active' | 'inactive'
// NO MORE TOGGLE BUG
//
router.put('/members/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role === 'admin') {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ FIXED: explicit status control
    user.status = req.body.status;

    await user.save();

    res.json({
      message: `Member is now ${user.status}`,
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// ── GET /api/admin/posts — Get all posts
//
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email profilePicture')
      .populate('comments.author', 'name profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// ── DELETE /api/admin/posts/:id — Delete post
//
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      message: 'Post has been deleted',
      post
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// ── PUT /api/admin/posts/:id/remove — Soft delete post
//
router.put('/posts/:id/remove', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.isRemoved = true;
    await post.save();

    res.json({
      message: 'Post has been removed',
      post
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;