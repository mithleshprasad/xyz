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
router.get('/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.query; 
    
    const tasks = await Task.find({ 
      boardId,
      userId 
    });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, boardId ,userId } = req.body;
    const task = new Task({
      title,
      description,
      status,
      boardId,
      userId: userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.put('/:id/status', async (req, res) => {
  console.log(req.body)
  try {
    const { status,userId } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
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

router.put('/:id', async (req, res) => {
  try {
    const { title, description, status,userId } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
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

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.params.userId
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
