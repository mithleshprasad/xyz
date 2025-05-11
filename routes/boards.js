const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Get all boards for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.session.userId });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create new board
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title } = req.body;
    const board = new Board({
      title,
      userId: req.session.userId
    });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;