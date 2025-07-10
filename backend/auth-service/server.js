const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use(cors());

// Routes
app.use("/auth", authRoutes);

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log("\x1b[36m%s\x1b[0m", `Auth service running on port ${PORT} 🔒🗝️`)
);
