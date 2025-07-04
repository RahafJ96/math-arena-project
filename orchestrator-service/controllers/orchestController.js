const axios = require("axios");
require("dotenv").config();

const AUTH = process.env.AUTH_SERVICE;
const GAME = process.env.GAME_SERVICE;
const PLAYER = process.env.PLAYER_SERVICE;

exports.register = async (req, res) => {
  try {
    console.log(`${AUTH}/auth/register`);
    const response = await axios.post(`${AUTH}/auth/register`, req.body);
    console.log(response.data);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const response = await axios.post(`${AUTH}/auth/login`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

exports.startGame = async (req, res) => {
  try {
    const response = await axios.post(`${GAME}/game/start`, req.body);
    console.log(response.data, "response.data");

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.post(`${GAME}/game/${id}/submit`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

exports.joinGame = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.put(`${GAME}/game/${id}/join`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

exports.endGame = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${GAME}/game/${id}/end`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

exports.getMyResult = async (req, res) => {
  try {
    const { game_id } = req.params;
    const { player_name } = req.query;
    const response = await axios.get(
      `${PLAYER}/result/me/${game_id}?player_name=${player_name}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

exports.getAllPlayers = async (req, res) => {
  try {
    const { game_id } = req.params;
    const response = await axios.get(`${PLAYER}/player/all/${game_id}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
