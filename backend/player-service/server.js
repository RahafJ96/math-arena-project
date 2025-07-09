const express = require('express');
const bodyParser = require('body-parser');
const playerRoutes = require('./routes/player');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/', playerRoutes);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Player service running on port ${PORT}`));