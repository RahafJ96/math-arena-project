const express = require('express');
const bodyParser = require('body-parser');
const gameRoutes = require('./routes/game');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/game', gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Game service running on port ${PORT}`));