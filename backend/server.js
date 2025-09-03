const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/crowdfunding');

const User = require('./models/User');

const Creator = mongoose.model('Creator', new mongoose.Schema({
  company: String,
  idea: String,
  name: String,
  amount: Number,
  userId: String, // Add userId to link to specific user
}));

const Investor = mongoose.model('Investor', new mongoose.Schema({
  investor: String,
  company: String,
  money: Number,
}));

// User Auth
app.post('/api/signup', async (req, res) => {
  const { username, password, role, email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required' });
  const usernameExists = await User.findOne({ username });
  if (usernameExists) return res.json({ success: false, message: 'Username already exists' });
  const emailExists = await User.findOne({ email });
  if (emailExists) return res.json({ success: false, message: 'Email already exists' });
  try {
    await User.create({ username, password, role, email });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 11000) {
      if (err.keyPattern && err.keyPattern.email) {
        return res.json({ success: false, message: 'Email already exists' });
      }
      if (err.keyPattern && err.keyPattern.username) {
        return res.json({ success: false, message: 'Username already exists' });
      }
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) res.json({ success: true, role: user.role, userId: user._id, username: user.username });
  else res.json({ success: false, message: 'Invalid credentials' });
});

// Creator APIs - Updated to filter by userId
app.post('/api/creator', async (req, res) => {
  const { company, idea, name, amount, userId } = req.body;
  await Creator.create({ company, idea, name, amount, userId });
  res.json({ success: true });
});

// Get all companies (for investor dashboard)
app.get('/api/creator', async (req, res) => {
  const data = await Creator.find();
  res.json(data);
});

// Existing: Get companies for a specific creator
app.get('/api/creator/:userId', async (req, res) => {
  const data = await Creator.find({ userId: req.params.userId });
  res.json(data);
});

app.put('/api/creator/:id', async (req, res) => {
  try {
    const updated = await Creator.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/api/creator/:id', async (req, res) => {
  try {
    await Creator.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Investor APIs
app.post('/api/investor', async (req, res) => {
  const { investor, company, money } = req.body;
  await Investor.create({ investor, company, money });
  res.json({ success: true });
});

app.get('/api/investor', async (req, res) => {
  const data = await Investor.find();
  res.json(data);
});

app.put('/api/investor/:id', async (req, res) => {
  try {
    const updated = await Investor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/api/investor/:id', async (req, res) => {
  try {
    await Investor.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Investment summary for each company
app.get('/api/investments/summary', async (req, res) => {
  try {
    const summary = await Investor.aggregate([
      {
        $group: {
          _id: '$company',
          totalInvested: { $sum: '$money' }
        }
      },
      {
        $project: {
          _id: 0,
          company: '$_id',
          totalInvested: 1
        }
      }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creator-specific investment summary
app.get('/api/investments/creator/:userId', async (req, res) => {
  try {
    // First, get all companies owned by this creator
    const creatorCompanies = await Creator.find({ userId: req.params.userId });
    const companyNames = creatorCompanies.map(company => company.company);
    
    if (companyNames.length === 0) {
      return res.json([]);
    }
    
    // Then get investments only for these companies
    const summary = await Investor.aggregate([
      {
        $match: {
          company: { $in: companyNames }
        }
      },
      {
        $group: {
          _id: '$company',
          totalInvested: { $sum: '$money' }
        }
      },
      {
        $project: {
          _id: 0,
          company: '$_id',
          totalInvested: 1
        }
      }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
