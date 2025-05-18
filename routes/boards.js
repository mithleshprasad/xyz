const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// Get all boards for user with search and filtering
router.get('/', async (req, res) => {
  const { userId, search, category } = req.query;
  
  try {
    let query = { userId };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    const boards = await Board.find(query).sort({ updatedAt: -1 });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.patch('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the board first to get current favorite status
    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    // Toggle the favorite status
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { isFavorite: !board.isFavorite, updatedAt: Date.now() },
      { new: true }
    );
    
    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Create new board
router.post('/', async (req, res) => {
  try {
    const { title, userId, category } = req.body;
    
    if (!title || !userId) {
      return res.status(400).json({ message: 'Title and userId are required' });
    }
    
    const board = new Board({
      title,
      userId,
      category: category || ''
    });
    
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update board
router.put('/:id', async (req, res) => {
  try {
    const { title, category } = req.body;
    const { id } = req.params;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { title, category, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete board
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBoard = await Board.findByIdAndDelete(id);
    
    if (!deletedBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
