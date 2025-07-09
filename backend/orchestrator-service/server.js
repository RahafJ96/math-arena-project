const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/orch');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/', routes);
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Orchestrator running on port ${PORT}`));
