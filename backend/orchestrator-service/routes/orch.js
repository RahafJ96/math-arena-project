const express = require('express');
const router = express.Router();
const { register, login, submitAnswer, joinGame, startGame, endGame, getMyResult, getAllPlayers } = require('../controllers/orchestController.js');

router.post('/register', register);
router.post('/login', login);

router.post('/game/start', startGame);
router.post('/game/:id/submit', submitAnswer);
router.put('/game/:id/join', joinGame);
router.get('/game/:id/end', endGame);

router.get('/result/me/:game_id', getMyResult);
router.get('/player/all/:game_id', getAllPlayers);

module.exports = router;
