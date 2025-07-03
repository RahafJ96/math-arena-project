const express = require('express');
const router = express.Router();
const axios = require('axios');

const AUTH_URL = 'http://localhost:4000/auth';
const GAME_URL = 'http://localhost:5000/game';

// AUTH ROUTES
router.post('/register', async (req, res) => {
  try {
    const result = await axios.post(`${AUTH_URL}/register`, req.body);
    res.json(result.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await axios.post(`${AUTH_URL}/login`, req.body);
    res.json(result.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Internal Error' });
  }
});

// GAME ROUTES
router.post('/game/start', async (req, res) => {
  try {
    const result = await axios.post(`${GAME_URL}/start`, req.body);
    res.json(result.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Game service error' });
  }
});

router.put('/game/:id/join', async (req, res) => {
  try {
    const result = await axios.put(`${GAME_URL}/${req.params.id}/join`, req.body);
    res.json(result.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Join error' });
  }
});

router.post('/game/:id/submit', async (req, res) => {
  try {
    const result = await axios.post(`${GAME_URL}/${req.params.id}/submit`, req.body);
    res.json(result.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Submit error' });
  }
});

router.get('/game/:id/end', async (req, res) => {
  try {
    const result = await axios.get(`${GAME_URL}/${req.params.id}/end`);
    res.json(result.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'End error' });
  }
});

module.exports = router;
