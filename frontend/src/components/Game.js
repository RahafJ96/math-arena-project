import React, { useState } from "react";
import axios from "axios";
import "../styles/game.css";

function Game() {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [question, setQuestion] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState("");
  const [submitUrl, setSubmitUrl] = useState("");
  const [timeStarted, setTimeStarted] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [results, setResults] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);

  const startGame = async () => {
    try {
      const res = await axios.post("http://localhost:5000/game/start", {
        name,
        difficulty,
      });
      const idMatch = res.data.submit_url.match(/\/game\/(\d+)\/submit/);
      const id = idMatch ? idMatch[1] : null;

      setGameId(id);
      setQuestion(res.data.question);
      setSubmitUrl(res.data.submit_url);
      setTimeStarted(res.data.time_started);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to start game.");
    }
  };

  const submitAnswer = async () => {
    try {
      const res = await axios.post(`http://localhost:5000${submitUrl}`, {
        player_name: name,
        answer: parseFloat(answer),
      });
      setMessage(res.data.result);
      setScore(res.data.current_score);
      setQuestion(res.data.next_question.question);
      setSubmitUrl(res.data.next_question.submit_url);
      setAnswer("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting answer.");
    }
  };

  const endGame = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/game/${gameId}/end`);
      setMessage(res.data.message);
      setGameEnded(true);
      setResults({
        finalScore: score,
        timeStarted,
        playerName: name,
      });

      const stats = await axios.get(
        `http://localhost:2000/result/me/${gameId}?player_name=${name}`
      );
      setPlayerStats(stats.data);
      console.log(stats.data, "PLAYER");
    } catch (err) {
      console.log(err, "ERROR");
      console.error(err);
      setMessage("⚠️ Failed to end game or fetch results.");
    }
  };

  return (
    <div className="game-container">
      <h1>🎮 Math Arena Battle</h1>

      {!question && !gameEnded && (
        <div className="setup-section">
          <input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
          </select>
          <button onClick={startGame}>Start Game 🚀</button>
        </div>
      )}

      {question && !gameEnded && (
        <div className="question-section">
          <h2>🧠 {question}</h2>
          <input
            type="number"
            placeholder="Your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={submitAnswer}>Submit Answer ✅</button>
          <p className="score">📊 Score: {score}</p>
          <button onClick={endGame} className="end-button">
            End Game ❌
          </button>
        </div>
      )}

      {message && <p className="game-message">🔔 {message}</p>}

      {gameEnded && results && (
        <div className="end-section">
          <h2>🏁 Game Over!</h2>
          <p>
            🎉 Well done, <strong>{results.playerName}</strong>!
          </p>
          <p>
            📊 Final Score: <strong>{results.finalScore}</strong>
          </p>
          <p>
            🕓 Started at: {new Date(results.timeStarted).toLocaleTimeString()}
          </p>

          {playerStats && (
            <div className="player-results">
              <h3>📈 Your Performance Summary</h3>
              <p>🧠 Difficulty: {playerStats.difficulty}</p>
              <p>🕐 Time Spent: {playerStats.total_time_spent.toFixed(2)}s</p>
              <p>
                🏅 Best Score: {playerStats.best_score?.question} ={" "}
                {playerStats.best_score?.answer} in{" "}
                {playerStats.best_score?.time_taken.toFixed(2)}s
              </p>

              <h4>📜 Answer History:</h4>
              <ul>
                {playerStats.history.map((entry, idx) => (
                  <li key={idx}>
                    {entry.question} = {entry.answer} —{" "}
                    {entry.correct ? "✅" : "❌"} ({entry.time_taken.toFixed(2)}
                    s)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p>🧠 Hope to see you in the next challenge!</p>
        </div>
      )}
    </div>
  );
}

export default Game;
