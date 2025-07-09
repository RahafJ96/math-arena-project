const db = require("../db/connection");

// GET my result
exports.getMyResult = async (req, res) => {
  const gameId = req.params.game_id;
  const playerName = req.query.player_name;
  try {
    // 1. Get all submissions by this player
    const [submissions] = await db.query(
      `SELECT question, submitted_answer, correct_answer, is_correct, time_taken 
       FROM submissions 
       WHERE game_id = ? AND player_name = ?`,
      [gameId, playerName]
    );

    if (submissions.length === 0) {
      return res.json({ message: `${playerName} has no submissions yet.` });
    }
    // 2. Get game difficulty
    const [[game]] = await db.query(
      `SELECT difficulty FROM games WHERE id = ?`,
      [gameId]
    );

    // 3. Prepare history and compute score
    let totalCorrect = 0;
    let totalTime = 0;
    let best = null;

    const history = submissions.map((s) => {
      const entry = {
        question: s.question,
        answer: s.submitted_answer,
        correct: !!s.is_correct,
        time_taken: parseFloat(s.time_taken),
      };

      if (s.is_correct) totalCorrect++;
      totalTime += entry.time_taken;

      // Find best score (fastest correct answer)
      if (s.is_correct) {
        if (!best || entry.time_taken < best.time_taken) {
          best = {
            question: s.question,
            answer: s.submitted_answer,
            time_taken: entry.time_taken,
          };
        }
      }

      return entry;
    });

    res.json({
      name: playerName,
      difficulty: game.difficulty,
      current_score: `${totalCorrect}/${submissions.length}`,
      total_time_spent: parseFloat(totalTime.toFixed(2)),
      best_score: best || null,
      history,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /player/all/:game_id
exports.getAllPlayers = async (req, res) => {
  const gameId = req.params.game_id;

  try {
    // 1. Get game difficulty
    const [[game]] = await db.query(
      `SELECT difficulty FROM games WHERE id = ?`,
      [gameId]
    );

    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    // 2. Get all player scores for this game
    const [scores] = await db.query(
      `SELECT player_name,
              COUNT(*) AS total_submitted,
              SUM(is_correct) AS total_correct,
              SUM(time_taken) AS total_time
       FROM submissions
       WHERE game_id = ?
       GROUP BY player_name`,
      [gameId]
    );

    if (scores.length === 0) {
      return res.json({
        difficulty: game.difficulty,
        winners: [],
        best_score: null,
        scores: [],
      });
    }

    // 3. Determine max correct answers
    const maxCorrect = Math.max(...scores.map((s) => Number(s.total_correct)));

    // 4. Filter players with the max correct answers
    const candidates = scores.filter(
      (s) => Number(s.total_correct) === maxCorrect
    );

    // 5. Get the minimum time among the top scorers
    const minTime = Math.min(...candidates.map((s) => Number(s.total_time)));

    // 6. Final winners: players with max correct & min time
    const winners = candidates
      .filter((s) => Number(s.total_time) === minTime)
      .map((s) => s.player_name);

    // 7. Get best (fastest) single correct answer
    const [[best]] = await db.query(
      `SELECT player_name, question, submitted_answer AS answer, time_taken 
       FROM submissions 
       WHERE is_correct = true AND game_id = ?
       ORDER BY time_taken ASC 
       LIMIT 1`,
      [gameId]
    );

    // 8. Respond with final structure
    res.json({
      difficulty: game.difficulty,
      winners,
      best_score: best || null,
      scores: scores.map((s) => ({
        player: s.player_name,
        total_correct: Number(s.total_correct),
        total_submitted: Number(s.total_submitted),
        total_time: parseFloat(Number(s.total_time).toFixed(2)),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
