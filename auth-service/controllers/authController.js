const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');



exports.registerUser = async (req, res) => {
  const { name, username, password } = req.body;
   try {
    const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, username, password) VALUES (?, ?, ?)', [
      name,
      username,
      hashedPassword,
    ]);

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ message: `Hello ${name}, your account is created.`, access_token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.json({ message: `Hello ${user.name}, welcome back.`, access_token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};