const express = require("express");
const bodyParser = require("body-parser");
const gameRoutes = require("./routes/game");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/game", gameRoutes);

// ✅ MUST come before any route definitions
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Game service running on port ${PORT}`));
