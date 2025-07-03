const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = []; // Simulated in-memory database

exports.registerUser = async (req, res) => {
  const { name, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = { name, username, password: hashedPassword };
  users.push(user);

  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.status(201).json({
    message: `Hello ${name}, your account is created`,
    access_token: token,
  });
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username }, process.env.JWT_SECRET);
  res.status(200).json({
    message: `Hello ${user.name}, welcome back`,
    access_token: token,
  });
};