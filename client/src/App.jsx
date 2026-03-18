import { useState, useEffect } from "react";
import "./App.css";

const CATEGORIES = ["general", "tech", "science"];

export default function App() {
  const [screen, setScreen] = useState("home"); // home | quiz | result | leaderboard
  const [playerName, setPlayerName] = useState("");
  const [category, setCategory] = useState("general");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(15);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (screen !== "quiz") return;
    setTimer(15);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          handleNext();
          return 15;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [current, screen]);

  const startQuiz = async () => {
    if (!playerName.trim()) return alert("Please enter your name!");
    const res = await fetch(`http://localhost:5001/api/questions/${category}`);
    const data = await res.json();
    setQuestions(data);
    setAnswers({});
    setCurrent(0);
    setSelected(null);
    setScreen("quiz");
  };

  const handleAnswer = (option) => {
    setSelected(option);
    setAnswers((prev) => ({ ...prev, [questions[current].id]: option }));
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const res = await fetch("http://localhost:5001/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName, answers, category }),
    });
    const data = await res.json();
    setResult(data);
    setScreen("result");
  };

  const loadLeaderboard = async () => {
    const res = await fetch("http://localhost:5001/api/leaderboard");
    const data = await res.json();
    setLeaderboard(data);
    setScreen("leaderboard");
  };

  if (screen === "home") return (
    <div className="app">
      <div className="container">
        <h1 className="title">🧠 Quiz App</h1>
        <div className="card">
          <input className="input" placeholder="Enter your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <p className="label">Choose Category:</p>
          <div className="category-btns">
            {CATEGORIES.map((c) => (
              <button key={c} className={`cat-btn ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
                {c === "general" ? "🌍 General" : c === "tech" ? "💻 Tech" : "🔬 Science"}
              </button>
            ))}
          </div>
          <button className="btn primary" onClick={startQuiz}>Start Quiz</button>
          <button className="btn secondary" onClick={loadLeaderboard}>🏆 Leaderboard</button>
        </div>
      </div>
    </div>
  );

  if (screen === "quiz" && questions.length > 0) {
    const q = questions[current];
    return (
      <div className="app">
        <div className="container">
          <div className="quiz-header">
            <span>Question {current + 1}/{questions.length}</span>
            <span className={`timer ${timer <= 5 ? "danger" : ""}`}>⏱ {timer}s</span>
          </div>
          <div className="progress-bar"><div style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
          <div className="card">
            <h2 className="question">{q.question}</h2>
            <div className="options">
              {q.options.map((opt) => (
                <button key={opt} className={`option ${selected === opt ? "selected" : ""}`} onClick={() => handleAnswer(opt)}>
                  {opt}
                </button>
              ))}
            </div>
            <button className="btn primary" onClick={handleNext}>
              {current + 1 === questions.length ? "Submit" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "result" && result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="app">
        <div className="container">
          <div className="card result-card">
            <div className="result-emoji">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "😅"}</div>
            <h2>Well done, {playerName}!</h2>
            <div className="score-circle">{result.score}/{result.total}</div>
            <p className="score-pct">{pct}% Correct</p>
            <p className="score-msg">{pct >= 80 ? "Excellent!" : pct >= 50 ? "Good job!" : "Keep practicing!"}</p>
            <button className="btn primary" onClick={() => setScreen("home")}>Play Again</button>
            <button className="btn secondary" onClick={loadLeaderboard}>🏆 Leaderboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "leaderboard") return (
    <div className="app">
      <div className="container">
        <h1 className="title">🏆 Leaderboard</h1>
        <div className="card">
          {leaderboard.map((s, i) => (
            <div key={s._id} className="lb-row">
              <span className="lb-rank">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
              <span className="lb-name">{s.playerName}</span>
              <span className="lb-score">{s.score}/{s.total}</span>
              <span className="lb-cat">{s.category}</span>
            </div>
          ))}
          {leaderboard.length === 0 && <p style={{ textAlign: "center", color: "#888" }}>No scores yet!</p>}
          <button className="btn secondary" onClick={() => setScreen("home")}>← Back</button>
        </div>
      </div>
    </div>
  );

  return null;
}
