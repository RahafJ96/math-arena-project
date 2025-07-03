const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT} ✌`));