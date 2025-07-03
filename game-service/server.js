const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const gameRoutes = require('./routes/game');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/game', gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Game service running on port ${PORT}`));
