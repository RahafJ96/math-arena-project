const express = require("express");
const router = express.Router();
const {
  startGame,
  joinGame,
  submitAnswer,
  endGame,
} = require("../controllers/gameController");

router.post("/start", startGame);
router.put("/:id/join", joinGame);
router.post("/:id/submit", submitAnswer);
router.get("/:id/end", endGame);

module.exports = router;
