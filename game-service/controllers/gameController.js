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

// Start the game
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

// Join the Game
exports.joinGame = (req, res) => {
  const { username } = req.body;
  const { id } = req.params;
  const game = games[id];
  if (!game) return res.status(404).json({ message: 'Game not found' });
  if (game.players.find(p => p.username === username))
    return res.status(400).json({ message: 'Already joined' });

  game.players.push({ username, score: 0, answers: [] });
  res.status(200).json({ message: `Player ${username} joined game ${id}` });
};

// Submit answer
exports.submitAnswer = (req, res) => {
  const { id } = req.params;
  const { username, answer } = req.body;
  const game = games[id];
  if (!game) return res.status(404).json({ message: 'Game not found' });
  if (game.status !== 'active') return res.status(400).json({ message: 'Game is not active' });

  const player = game.players.find(p => p.username === username);
  if (!player) return res.status(404).json({ message: 'Player not in game' });

  const currentQ = game.questions[game.current];
  const correct = currentQ.answer === Number(answer);
  if (correct) player.score += 1;
  player.answers.push({ question: currentQ.q, answer, correct });
  game.current += 1;

  const next = game.questions[game.current];
  res.status(200).json({ correct, next });
};

// End Game
exports.endGame = (req, res) => {
  const { id } = req.params;
  const game = games[id];
  if (!game) return res.status(404).json({ message: 'Game not found' });
  game.status = 'ended';

  const results = game.players.map(p => ({ username: p.username, score: p.score }));
  res.status(200).json({ gameId: id, results });
};