const express = require('express');
const router = express.Router();
const { startGame } = require('../controllers/gameController');

router.post('/start', startGame);

module.exports = router;