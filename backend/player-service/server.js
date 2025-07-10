const express = require("express");
const bodyParser = require("body-parser");
const playerRoutes = require("./routes/player");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/", playerRoutes);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () =>
  console.log(
    "\x1b[35m%s\x1b[0m",
    `Player service running on port ${PORT} 🏃‍➡️💻`
  )
);
