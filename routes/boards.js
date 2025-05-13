const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// Get all boards for user
router.get('/', async (req, res) => {
  const { userId } = req.query; // Changed from req.body to req.query for GET request
  try {
    const boards = await Board.find({ userId });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create new board
router.post('/', async (req, res) => {
  try {
    const { title, userId } = req.body;
    const board = new Board({
      title,
      userId
    });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
