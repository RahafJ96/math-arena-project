# 🧠 Math Arena – Microservices Backend

Math Arena is a competitive math game backend built with Node.js using a microservices architecture. It supports single/multiplayer game logic, user authentication, and modular service communication through an orchestrator.

---

## 📦 Project Structure
```
math-arena/
├── auth-service/            # Handles user registration & login
├── game-service/            # Core game logic (questions, answers, scoring)
├── orchestrator-service/    # API gateway that routes all requests
```

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone <your-repo-url>
cd math-arena
```

### 2. Install Dependencies for Each Service
```bash
cd auth-service
npm install
cd ../game-service
npm install
cd ../orchestrator-service
npm install
```

### 3. Run All Services
Open 3 terminals and run:
```bash
# Terminal 1 - Auth
cd auth-service
node server.js

# Terminal 2 - Game
cd game-service
node server.js

# Terminal 3 - Orchestrator
cd orchestrator-service
node server.js
```

 

---

## 📡 API Endpoints (via Orchestrator)

### 🔐 Auth Routes
| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| POST   | /register         | Register a new user  |
| POST   | /login            | Login & get token    |

### 🎮 Game Routes
| Method | Endpoint                 | Description                  |
|--------|--------------------------|------------------------------|
| POST   | /game/start              | Start a new game             |
| PUT    | /game/:id/join           | Join an existing game        |
| POST   | /game/:id/submit         | Submit answer to a question |
| GET    | /game/:id/end            | End game and get results     |

---

## 🔐 Security
- Passwords hashed with **bcryptjs**
- JWT tokens issued and validated

---