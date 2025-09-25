import React, { useState, useEffect } from "react";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import './App.css';

function App() {
  const [theme, setTheme] = useState("light");

    useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2
    },
    {
      question: "Which language is primarily used for web development?",
      options: ["Python", "JavaScript", "Java", "C++"],
      correct: 1
    },
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Syntax"
      ],
      correct: 2
    },
    {
      question: "Which of these is a JavaScript framework?",
      options: ["Django", "Laravel", "React", "Flask"],
      correct: 2
    },
    {
      question: "What is the output of: console.log(typeof null)?",
      options: ["null", "undefined", "object", "string"],
      correct: 2
    },
    {
      question: "Which method adds new elements to an array?",
      options: ["push()", "add()", "append()", "insert()"],
      correct: 0
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Timer effect
  useEffect(() => {
    if (quizStarted && !quizFinished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, quizStarted, quizFinished]);

  const checkAnswer = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
    
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setQuizFinished(true);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
  };

  const getFeedback = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return "Outstanding! You're a JavaScript master!";
    if (percentage >= 75) return "Excellent! You have great knowledge!";
    if (percentage >= 60) return "Good job! Solid understanding.";
    if (percentage >= 40) return "Not bad! Keep practicing.";
    return "Keep learning! Every expert was once a beginner.";
  };

  return (
    <div className="app-container">
      {!quizStarted && !quizFinished && (
        <Header toggleTheme={toggleTheme} theme={theme} />
      )}
      <main className="main-content">
        {!quizStarted && !quizFinished ? (
          <div className="quiz-intro">
            <div className="intro-content">
              <h1>Quiz Time</h1>
              <p>
                JavaScript Test with this comprehensive interactive quiz! 
                You'll have {questions.length} challenging questions to answer with a 30-second timer for each question.
                Perfect for beginners and experienced developers alike.
              </p>
              <div className="quiz-stats">
                <div className="stat">
                  <span className="stat-number">{questions.length}</span>
                  <span className="stat-label">&nbsp;Questions</span>
                </div>
                <div className="stat">
                  <span className="stat-number">30s</span> 
                  <span className="stat-label">&nbsp;Per Question</span>
                </div>
                <div className="stat">
                  <span className="stat-number">All</span>
                  <span className="stat-label">&nbsp;Levels</span>
                </div>
              </div>
              <button className="cta-button" onClick={startQuiz}>
                Start Quiz Now
              </button>
            </div>
          </div>
        ) : quizFinished ? (
          <div className="quiz-results">
            <div className="results-content">
              <h1>Quiz Completed! 🎉</h1>
              <div className="score-card">
                <div className="score-circle">
                  <span className="score-percentage">
                    {((score / questions.length) * 100).toFixed(0)}%
                  </span>
                </div>
                <h2>Your Score: {score} / {questions.length}</h2>
                <p className="feedback">{getFeedback()}</p>
                <div className="score-breakdown">
                  <div className="breakdown-item correct-breakdown">
                    <span>Correct</span>
                    <span>{score}</span>
                  </div>
                  <div className="breakdown-item incorrect-breakdown">
                    <span>Incorrect</span>
                    <span>{questions.length - score}</span>
                  </div>
                  <div className="breakdown-item total-breakdown">
                    <span>Total</span>
                    <span>{questions.length}</span>
                  </div>
                </div>
              </div>
              <div className="results-actions">
                <button className="cta-button primary" onClick={resetQuiz}>
                  Try Again
                </button>
                <button className="cta-button secondary" onClick={resetQuiz}>
                  New Quiz
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="quiz-container">
            <div className="quiz-header">
              <div className="quiz-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <span>Question {currentQuestion + 1} of {questions.length}</span>
              </div>
              
              <div className="quiz-info">
                <div className="info-item">
                  <span className="info-label">Score:</span>
                  <span className="info-value">{score}</span>
                </div>
                <div className="info-item timer">
                  <span className="info-label">Time:</span>
                  <span className="info-value">{timeLeft}s</span>
                </div>
              </div>
            </div>

            <div className="question-section">
              <h2 className="question-text">
                {questions[currentQuestion].question}
              </h2>
              
              <div className="options-grid">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-card ${
                      selectedAnswer !== null && index === questions[currentQuestion].correct
                        ? 'correct'
                        : selectedAnswer === index && selectedAnswer !== questions[currentQuestion].correct
                        ? 'incorrect'
                        : ''
                    } ${selectedAnswer === index ? 'selected' : ''}`}
                    onClick={() => checkAnswer(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                    {selectedAnswer !== null && index === questions[currentQuestion].correct && (
                      <span className="feedback-icon correct">✓</span>
                    )}
                    {selectedAnswer === index && selectedAnswer !== questions[currentQuestion].correct && (
                      <span className="feedback-icon incorrect">✗</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedAnswer !== null && (
              <div className="answer-feedback">
                <div className={`feedback-message ${
                  selectedAnswer === questions[currentQuestion].correct ? 'correct' : 'incorrect'
                }`}>
                  <h3>
                    {selectedAnswer === questions[currentQuestion].correct
                      ? "✅ Correct! Well done!"
                      : "❌ Incorrect. Better luck next time!"}
                  </h3>
                  <p>You selected: {questions[currentQuestion].options[selectedAnswer]}</p>
                </div>
                <button 
                  className="next-button"
                  onClick={handleNextQuestion}
                >
                  {currentQuestion < questions.length - 1 ? "Next Question →" : "See Final Results"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      
      {!quizStarted && !quizFinished && <Footer />}

    </div>
  );
}

export default App;