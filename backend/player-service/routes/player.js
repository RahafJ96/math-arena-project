const express = require('express');
const router = express.Router();
const { getMyResult, getAllPlayers } = require('../controllers/playerController');


router.get('/result/me/:game_id', getMyResult);
router.get('/player/all/:game_id', getAllPlayers);

module.exports = router;
