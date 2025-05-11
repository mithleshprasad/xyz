const express = require('express');
const router = express.Router();
const User = require('../models/User');

// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
    
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     console.log(existingUser)
//     const user = new User({ username, password });
//     await user.save();
//     req.session.userId = user._id;
    
//     res.status(201).json({ message: 'User created successfully', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });
// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password)
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Check if email exists
    console.log(existingUser)
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // Create new user
    const user = new User({ username, email, password });
    await user.save();
    
    // Set session
    req.session.userId = user._id;
    
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    req.session.userId = user._id;
    
    res.json({ message: 'Logged in successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/check', (req, res) => {
  if (req.session.userId) {
    return res.json({ loggedIn: true });
  }
  res.json({ loggedIn: false });
});

module.exports = router;