import React, { useState, useEffect } from "react";
import { Alert } from 'react-bootstrap';
import FlashCard from "./FlashCard";
import NavUser from "../nav-user/NavUser";
import InfoNav from "../info-nav/InfoNav";
import "./FlashCards.css";

const generateQuestion = () => {
  const num1 = Math.floor(Math.random() * 8) + 2; // 2 through 9
  const num2 = Math.floor(Math.random() * 9) + 1; // 1 through 9
  const correctAnswer = num1 * num2;
  const wrongAnswer = correctAnswer + (Math.random() > 0.5 ? 1 : -1); // similar but incorrect answer

  return {
    question: `${num1} x ${num2} = `,
    options: [
      { value: correctAnswer, isCorrect: true },
      { value: wrongAnswer, isCorrect: false },
    ].sort(() => Math.random() - 0.5), // shuffle options
  };
};

export default function FlashCards() {
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
  const [correctCount, setCorrectCount] = useState(0);
  const [stars, setStars] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [emeralds, setEmeralds] = useState(0);
  const [gems, setGems] = useState(0);
  const [timer, setTimer] = useState(5);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Start the timer only from the second question onwards
    if (correctCount > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval);
            // Reset game if time runs out
            setCorrectCount(0);
            setCurrentQuestion(generateQuestion());
            return 5;
          } else {
            return prevTimer - 1;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentQuestion, correctCount]);

  useEffect(() => {
    let timer;
    if (showAlert) {
      // Set a timer to hide the alert after 3 seconds
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }

    // Clear the timer if the component unmounts or if showAlert changes
    return () => clearTimeout(timer);
  }, [showAlert]);


  // Update the handleAnswer function to include new rewards
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
     
      if (newCorrectCount % 10 === 0) {
        setStars(stars + 1);
      }
      if (newCorrectCount % 30 === 0) {
        setDiamonds(diamonds + 1);
      }
      if (newCorrectCount % 50 === 0) {
        setEmeralds(emeralds + 1);
      }
      if (newCorrectCount % 100 === 0) {
        setGems(gems + 1);
      }
      setCurrentQuestion(generateQuestion());
      setTimer(5);
    } else {
      setCorrectCount(0); 
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => setShowAlert(false);

  const renderIcons = (count, icon) => {
    let icons = [];
    for (let i = 0; i < count; i++) {
      icons.push(<span key={i} className="icon">{icon}</span>);
    }
    return icons;
  };
  
  return (
    <>
      <NavUser />
      <InfoNav />
      
      <div className="container game-container mt-4">
        <FlashCard
          question={currentQuestion.question}
          options={currentQuestion.options}
          onAnswer={handleAnswer}
          timer={timer}
        />
        {showAlert && (
        <Alert variant="danger" onClose={handleAlertClose} dismissible>
          <Alert.Heading>Incorrect Answer!</Alert.Heading>
          <p>Wrong answer! Try again.</p>
        </Alert>
      )}
        <div className="score-board mt-3">
          <p className="correct-answers">
            Correct Answers: <span className="count">{correctCount}</span>
          </p>
          <p className="stars">
            Stars: <span className="icons new-star">{renderIcons(stars, "⭐")}</span>
          </p>
          <p className="diamonds">
            Diamonds: <span className="icons new-diamond">{renderIcons(diamonds, "🔷")}</span>
          </p>
          <p className="emeralds">
            Emeralds: <span className="icons new-emerald">{renderIcons(emeralds, "🔮")}</span>
          </p>
          <p className="gems">
            Gems: <span className="icons new-gem">{renderIcons(gems, "👑")}</span>
          </p>
        </div>
      </div>
    </>
  );
  
}
