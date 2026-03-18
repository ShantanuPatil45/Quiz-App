# 🧠 Quiz App

A full-stack quiz application with categories, timer, and leaderboard built with React and Node.js.

![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

## ✨ Features
- 🌍 3 Categories: General, Tech, Science
- ⏱️ 15-second countdown timer per question
- 🏆 Leaderboard with top 10 scores
- 📊 Score results with performance feedback
- 🎨 Animated glassmorphism UI

## 🛠️ Tech Stack
- **Frontend:** React, Vite, CSS3
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Make sure MongoDB is running locally
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

## 📁 Folder Structure
```
quiz-app/
├── client/         # React frontend
│   └── src/
│       ├── App.jsx
│       └── App.css
└── server/         # Node.js backend
    ├── index.js
    ├── .env.example
    └── package.json
```


