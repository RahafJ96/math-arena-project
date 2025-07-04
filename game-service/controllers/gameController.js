const db = require("../db/connection");

function generateQuestion(difficulty) {
  const ops = ["+", "-", "*", "/"];
  const count = difficulty + 1;
  let question = "";

  for (let i = 0; i < count; i++) {
    const num = Math.floor(Math.random() * Math.pow(10, difficulty));
    question += num;
    if (i < count - 1) {
      question += ` ${ops[Math.floor(Math.random() * ops.length)]} `;
    }
  }

  return question;
}

// Start the game
exports.startGame = async (req, res) => {
  const { name, difficulty } = req.body;
  const question = generateQuestion(difficulty);
  const timeStarted = new Date();

  try {
    const [result] = await db.query(
      "INSERT INTO games (creator_name, difficulty, question, time_started, ended) VALUES (?, ?, ?, ?, ?)",
      [name, difficulty, question, timeStarted, false]
    );

    const gameId = result.insertId;

    await db.query("INSERT INTO players (game_id, name) VALUES (?, ?)", [
      gameId,
      name,
    ]);

    res.json({
      message: `Hello ${name}, find your submit API URL below`,
      submit_url: `/game/${gameId}/submit`,
      question,
      time_started: timeStarted,
    });
  } catch (err) {
    console.error("Error starting game:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.joinGame = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [games] = await db.query("SELECT * FROM games WHERE id = ?", [id]);
    const game = games[0];

    if (!game || game.ended) {
      return res.status(400).json({
        result: `Sorry ${name || "Guest"}, game ended or already joined.`,
      });
    }

    await db.query("INSERT INTO players (game_id, name) VALUES (?, ?)", [
      id,
      name || "Guest",
    ]);

    return res.json({
      result: `Welcome ${name || "Guest"}, now you can participate!`,
      next_question: {
        submit_url: `/game/${id}/submit`,
        question: game.question,
      },
    });
  } catch (err) {
    console.error("Error joining game:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  const { id } = req.params;
  const { answer, player_name } = req.body;

  try {
    const [games] = await db.query("SELECT * FROM games WHERE id = ?", [id]);
    if (games.length === 0)
      return res.status(404).json({ message: "Game not found" });

    const game = games[0];
    const correctAnswer = parseFloat(eval(game.question.replace(/x/g, "*")));
    const isCorrect = parseFloat(answer) === correctAnswer;
    const submittedAt = new Date();
    const timeTaken = (submittedAt - new Date(game.time_started)) / 1000;

    await db.query(
      `INSERT INTO submissions 
       (game_id, player_name, question, submitted_answer, correct_answer, is_correct, time_taken, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        player_name,
        game.question,
        answer,
        correctAnswer,
        isCorrect,
        timeTaken,
        submittedAt,
      ]
    );

    const nextQuestion = generateQuestion(game.difficulty);
    await db.query("UPDATE games SET question = ? WHERE id = ?", [
      nextQuestion,
      id,
    ]);

    const [scores] = await db.query(
      "SELECT COUNT(*) AS total, SUM(is_correct) AS correct FROM submissions WHERE game_id = ? AND player_name = ?",
      [id, player_name]
    );
    const { total, correct } = scores[0];

    return res.json({
      result: isCorrect
        ? `Good job ${player_name}, your answer is correct!`
        : `Sorry ${player_name}, your answer is incorrect.`,
      time_taken: timeTaken,
      current_score: `${correct || 0}/${total || 0}`,
      next_question: {
        submit_url: `/game/${id}/submit`,
        question: nextQuestion,
      },
    });
  } catch (err) {
    console.error("Error in submit:", err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.endGame = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("UPDATE games SET ended = ? WHERE id = ?", [true, id]);
    res.json({ message: "Game ended successfully." });
  } catch (err) {
    console.error("Error ending game:", err.message);
    res.status(500).json({ error: err.message });
  }
};
