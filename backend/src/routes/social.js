import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Journal from '../models/Journal.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import Connection from '../models/Connection.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Check if users are connected
const checkConnection = async (userId1, userId2) => {
  const connection = await Connection.findOne({
    $or: [
      { requester: userId1, recipient: userId2, status: 'accepted' },
      { requester: userId2, recipient: userId1, status: 'accepted' }
    ]
  });
  return !!connection;
};

// Like a journal
router.post('/journals/:journalId/like', authenticate, async (req, res) => {
  try {
    const { journalId } = req.params;
    const userId = req.userId;

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ error: 'Journal not found' });

    // Check if users are connected
    const isConnected = await checkConnection(userId, journal.userId);
    if (!isConnected) {
      return res.status(403).json({ error: 'Must be connected to like this journal' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      userId,
      targetType: 'Journal',
      targetId: journalId
    });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id });
      await Journal.findByIdAndUpdate(journalId, {
        $inc: { likesCount: -1 },
        $pull: { likes: existingLike._id }
      });
      return res.json({ liked: false, likesCount: journal.likesCount - 1 });
    }

    // Create new like
    const newLike = await Like.create({
      userId,
      targetType: 'Journal',
      targetId: journalId
    });

    await Journal.findByIdAndUpdate(journalId, {
      $inc: { likesCount: 1 },
      $push: { likes: newLike._id }
    });

    res.json({ liked: true, likesCount: journal.likesCount + 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment to journal
router.post('/journals/:journalId/comment', authenticate, async (req, res) => {
  try {
    const { journalId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ error: 'Journal not found' });

    // Check if users are connected
    const isConnected = await checkConnection(userId, journal.userId);
    if (!isConnected) {
      return res.status(403).json({ error: 'Must be connected to comment' });
    }

    const newComment = await Comment.create({
      userId,
      targetType: 'Journal',
      targetId: journalId,
      content
    });

    await Journal.findByIdAndUpdate(journalId, {
      $inc: { commentsCount: 1 },
      $push: { comments: newComment._id }
    });

    // Populate user info for the response
    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'name profile.avatar');

    res.json({
      comment: populatedComment,
      commentsCount: journal.commentsCount + 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get journal comments
router.get('/journals/:journalId/comments', authenticate, async (req, res) => {
  try {
    const { journalId } = req.params;
    const userId = req.userId;

    const journal = await Journal.findById(journalId);
    if (!journal) return res.status(404).json({ error: 'Journal not found' });

    const comments = await Comment.find({ targetId: journalId, targetType: 'Journal' })
      .populate('userId', 'name profile.avatar')
      .sort('-createdAt');

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this route
router.get('/check-connection/:userId', authenticate, async (req, res) => {
  try {
    const isConnected = await checkConnection(req.userId, req.params.userId);
    res.json({ isConnected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;