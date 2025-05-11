const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Get all tasks for a board
router.get('/:boardId', requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ 
      boardId: req.params.boardId,
      userId: req.session.userId
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create new task
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, status, boardId } = req.body;
    const task = new Task({
      title,
      description,
      status,
      boardId,
      userId: req.session.userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update task status
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Update task (full update)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { title, description, status, updatedAt: Date.now() },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
// Delete task
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;