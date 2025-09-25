import React, { useState, useEffect } from "react";
import './App.css';

const QuizPage = () => {
  const questions = [
    { question: "What is the capital of France?", options: ["London","Berlin","Paris","Madrid"], correct: 2 },
    { question: "Which language is primarily used for web development?", options: ["Python","JavaScript","Java","C++"], correct: 1 },
    { question: "What does CSS stand for?", options: ["Computer Style Sheets","Creative Style System","Cascading Style Sheets","Colorful Style Syntax"], correct: 2 },
    { question: "Which of these is a JavaScript framework?", options: ["Django","Laravel","React","Flask"], correct: 2 },
    { question: "What is the output of: console.log(typeof null)?", options: ["null","undefined","object","string"], correct: 2 },
    { question: "Which method adds new elements to an array?", options: ["push()","add()","append()","insert()"], correct: 0 }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else handleNextQuestion();
  }, [timeLeft]);

  const checkAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) setScore(score + 1);
    setTimeout(() => handleNextQuestion(), 1000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      alert(`Quiz Finished! Your score: ${score}/${questions.length}`);
      window.close();
    }
  };

  return (
    <main className="main-content">
      <div className="quiz-container">
        <h2>{questions[currentQuestion].question}</h2>
        <div className="options-grid">
          {questions[currentQuestion].options.map((opt, i) => (
            <button
              key={i}
              className={`option-card ${selectedAnswer === i ? "selected" : ""}`}
              onClick={() => checkAnswer(i)}
              disabled={selectedAnswer !== null}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="quiz-info">
          <span>Score: {score}</span> | <span>Time Left: {timeLeft}s</span>
        </div>
      </div>
    </main>
  );
};

export default QuizPage;
