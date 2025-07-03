const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Orchestrator running on port ${PORT} ✌`));