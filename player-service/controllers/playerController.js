const db = require('../db/connection');

// GET my result
exports.getMyResult = async (req, res) => {
  const gameId = req.params.game_id;
  const playerName = req.query.player_name;
  try {
    const [results] = await db.query(
      `SELECT COUNT(*) AS total_submitted,
              SUM(is_correct) AS total_correct,
              SUM(time_taken) AS total_time
       FROM submissions
       WHERE game_id = ? AND player_name = ?`,
      [gameId, playerName]
    );

    if (!results[0].total_submitted) {
      return res.json({ message: `${playerName} has no submissions yet.` });
    }

    res.json({
      player: playerName,
      total_submitted: results[0].total_submitted,
      total_correct: results[0].total_correct,
      total_time: results[0].total_time.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /player/all/:game_id
exports.getAllPlayers = async (req, res) => {
  const gameId = req.params.game_id;

  try {
    const [rows] = await db.query(
      `SELECT player_name,
              COUNT(*) AS total_submitted,
              SUM(is_correct) AS total_correct,
              SUM(time_taken) AS total_time
       FROM submissions
       WHERE game_id = ?
       GROUP BY player_name
       ORDER BY total_correct DESC, total_time ASC`
      , [gameId]);

    res.json({
      game_id: gameId,
      players: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
