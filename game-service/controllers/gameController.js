const { v4: uuidv4 } = require('uuid');
const games = require('../data/games');

function generateQuestions(difficulty = 'easy') {
  const questions = [];
  const ops = ['+', '-', '*'];
  for (let i = 0; i < 5; i++) {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const op = ops[Math.floor(Math.random() * ops.length)];
    const q = `${a} ${op} ${b}`;
    const answer = eval(q);
    questions.push({ q, answer });
  }
  return questions;
}

exports.startGame = (req, res) => {
  const { username } = req.body;
  const gameId = uuidv4();
  const questions = generateQuestions();

  games[gameId] = {
    id: gameId,
    players: [{ username, score: 0 }],
    questions,
    current: 0,
    status: 'active'
  };

  res.status(201).json({ gameId, questions });
};
