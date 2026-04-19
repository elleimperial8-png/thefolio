const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

/* ─────────────────────────────
   GET ALL POSTS (PUBLIC)
───────────────────────────── */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePicture') // FIXED
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─────────────────────────────
   GET SINGLE POST
───────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture'); // FIXED

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─────────────────────────────
   CREATE POST
───────────────────────────── */
router.post(
  '/',
  protect,
  memberOrAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, body } = req.body;

      const image = req.file ? `/uploads/${req.file.filename}` : '';

      const post = await Post.create({
        title,
        body,
        image,
        author: req.user._id
      });

      await post.populate('author', 'name profilePicture'); // FIXED

      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ─────────────────────────────
   UPDATE POST
───────────────────────────── */
router.put(
  '/:id',
  protect,
  memberOrAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const isOwner = post.author.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      post.title = req.body.title || post.title;
      post.body = req.body.body || post.body;

      if (req.file) {
        post.image = `/uploads/${req.file.filename}`;
      }

      await post.save();

      await post.populate('author', 'name profilePicture'); // FIXED

      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ─────────────────────────────
   DELETE POST
───────────────────────────── */
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─────────────────────────────
   LIKE / UNLIKE POST (FIXED SAFE VERSION)
───────────────────────────── */
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;

    // SAFE ARRAY CHECK
    if (!post.likes) post.likes = [];

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      likes: post.likes.length,
      liked: !alreadyLiked,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;