# 🧠 Math Arena – Microservices Backend

**Math Arena** is a microservices-based competitive math game backend built with Node.js, MySQL, and Express. It allows players to register, start or join a game, solve math questions, and view score results, all through scalable services.

## 📦 Project Structure

```
math-arena/
├── auth-service/            # Handles user registration & login
├── game-service/            # Handles game logic (start, join, submit, end)
├── player-service/          # Shows player scores and game results
└── orchestrator-service/    # Routes and controls all microservices

```

## 🔧 Microservices

- **Auth Service (4000):** Handles registration and login (with JWT)
- **Game Service (5000):** Handles game logic (start, join, submit, end)
- **Player Service (2000):** Shows results for players

---

## 🚀 Tech Stack

| Layer     | Tech       |
| --------- | ---------- |
| Language  | Node.js    |
| Framework | Express.js |
| Database  | MySQL      |

## 🗃️ Database Schema (MySQL)

### Database: `math_arena`

### 🛠 SQL to Run:

```sql
CREATE DATABASE IF NOT EXISTS math_arena;
USE math_arena;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  creator_name VARCHAR(255),
  difficulty INT,
  question TEXT,
  time_started DATETIME,
  ended BOOLEAN
);

CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT,
  name VARCHAR(255),
  FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT,
  player_name VARCHAR(255),
  question TEXT,
  submitted_answer FLOAT,
  correct_answer FLOAT,
  is_correct BOOLEAN,
  time_taken FLOAT,
  submitted_at DATETIME,
  FOREIGN KEY (game_id) REFERENCES games(id)
);
```

## 🌐 API Endpoints via Gateway

### 🔐 Auth Routes

| Method | Endpoint    | Description           |
| ------ | ----------- | --------------------- |
| POST   | `/register` | Register new user     |
| POST   | `/login`    | Login & get JWT token |

### 🎮 Game Routes

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | `/game/start`      | Start a new game   |
| PUT    | `/game/:id/join`   | Join existing game |
| POST   | `/game/:id/submit` | Submit an answer   |
| GET    | `/game/:id/end`    | End game           |

### 📊 Player Routes

| Method | Endpoint                            | Description                  |
| ------ | ----------------------------------- | ---------------------------- |
| GET    | `/result/me/:game_id?player_name=x` | Your result for a game       |
| GET    | `/player/all/:game_id`              | All player results in a game |

## 🔐 How to Test with Postman

1. **Register**

   ```
   POST http://localhost:1000/register
   Body:
   {
     "name": "Rahaf",
     "username": "rahaf96",
     "password": "123456"
   }
   ```

2. **Login**

   ```
   POST http://localhost:1000/login
   Body:
   {
     "name": "Rahaf",
     "username": "rahaf96",
     "password": "123456"
   }
   Response will include:
   {
     "message": "Hello Rahaf, welcome back.",
     "access_token": "ey...."
   }
   ```

3. **Start a Game**

   ```
   POST /game/start
   Body:
   {
     "name": "Rahaf",
     "difficulty": 1
   }
   res:
   {
    "message": "Hello Rahaf, find your submit API URL below",
    "submit_url": "/game/2/submit",
    "question": "9 - 3",
    "time_started": "2025-07-04T12:53:57.292Z"
   }
   ```

4. **Join a Game**

   ```
   PUT /game/2/join
   Body:
   {
     "name": "Rahaf",
   }
   res:
   {
    "result": "Welcome Rahaf, now you can participate!",
    "next_question": {
        "submit_url": "/game/2/submit",
        "question": "9 - 3"
    }
   }
   ```

5. **Submit Answer**

   ```
   POST /game/2/submit
   Body:
   {
     "player_name": "Rahaf",
     "answer": 6
   }
   res:
   {
    "result": "Good job Rahaf, your answer is correct!",
    "time_taken": 224.507,
    "current_score": "1/1",
    "next_question": {
        "submit_url": "/game/2/submit",
        "question": "3 * 2"
    }
   }
   ```

6. **End Game**

   ```
   GET /game/2/end
   res:
   {
    "message": "Game ended successfully."
   }
   ```

7. **View Player Result**

   ```
   GET /result/me/2?player_name=Rahaf
   res:
   {
    "player": "rahaf",
    "total_submitted": 1,
    "total_correct": "1",
    "total_time": "224.51"
   }
   ```

8. **View Game Result**

   ```
   GET /player/all/2
   res:
   {
    "game_id": "2",
    "players": [
        {
            "player_name": "Rahaf",
            "total_submitted": 1,
            "total_correct": "1",
            "total_time": 224.5070037841797
        }
    ]
   }
   ```

## 📦 Postman Collection

> 🔗 _You can import this JSON file into Postman to test all endpoints._ [Postman Collection](./utils/Orchestrator.postman_collection.json).
