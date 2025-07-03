const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT} ✌`));