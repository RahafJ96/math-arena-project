# 🧠 Math Arena – Microservices Backend

**Math Arena** is a microservices-based competitive math game backend built with Node.js, MySQL, and Express. It allows players to register, start or join a game, solve math questions, and view score results, all through scalable services.


## 📦 Project Structure
```
math-arena/
├── auth-service/            # Handles user registration & login
├── game-service/            # Handles game logic (start, join, submit, end)
├── player-service/          # Shows player scores and game results
```

## 🔧 Microservices

- **Auth Service (4000):** Handles registration and login (with JWT)
- **Game Service (5000):** Handles game logic (start, join, submit, end)
- **Player Service (2000):** Shows results for players

---

## 🚀 Tech Stack

| Layer         | Tech                   |
|---------------|------------------------|
| Language      | Node.js                |
| Framework     | Express.js             |
| Database      | MySQL                  |


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

## 📦 Postman Collection

You can access and test the API using this [Postman Collection](./utils/math-arena.postman_collection.json).

