// src/screens/multiplication-game/MultiplicationGame.js
import React, { useState, useEffect, useCallback } from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap'; // Keep Bootstrap Alert if you like it
import MultiplicationCard from '../../components/flash-card/MultiplicationCard'; // Adjust path
import { FaStar, FaGem, FaCreativeCommonsPdAlt, FaCrown } from 'react-icons/fa'; // Using different icons for variety

// This function is already multiplication-focused
const generateQuestion = () => {
  const num1 = Math.floor(Math.random() * 9) + 2; // 2 through 10 (adjusted slightly from 9+1 for full range up to 10x)
  const num2 = Math.floor(Math.random() * 10) + 1; // 1 through 10
  const correctAnswer = num1 * num2;
  
  // Generate diverse wrong answers
  let wrongAnswer1 = correctAnswer + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
  if (wrongAnswer1 === correctAnswer || wrongAnswer1 < 0) wrongAnswer1 = correctAnswer + 5; // ensure different and positive

  let wrongAnswer2 = num1 * (num2 === 1 ? num2 + 1 : num2 -1); // common error type
  if (wrongAnswer2 === correctAnswer || wrongAnswer2 < 0) wrongAnswer2 = correctAnswer - 3 > 0 ? correctAnswer -3 : correctAnswer + 3;

  // Ensure all options are unique and positive
  const optionsSet = new Set();
  optionsSet.add(correctAnswer);
  
  const ensureUniqueAndPositive = (val, existingSet, baseCorrect) => {
      let tempVal = val;
      while(existingSet.has(tempVal) || tempVal < 0) {
          tempVal = baseCorrect + (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1);
          if (tempVal < 0) tempVal = baseCorrect + (Math.floor(Math.random() * 5) +1); // try to make it positive
      }
      existingSet.add(tempVal);
      return tempVal;
  }

  wrongAnswer1 = ensureUniqueAndPositive(wrongAnswer1, optionsSet, correctAnswer);
  wrongAnswer2 = ensureUniqueAndPositive(wrongAnswer2, optionsSet, correctAnswer);


  return {
    question: `${num1} × ${num2} = `, // Using × symbol
    options: [
      { value: correctAnswer, isCorrect: true },
      { value: wrongAnswer1, isCorrect: false },
      // { value: wrongAnswer2, isCorrect: false }, // For 2 options total
    ].sort(() => Math.random() - 0.5), // shuffle options for 2 total options
    // If you want 3 or 4 options, add more wrong answers and ensure uniqueness
  };
};

const MultiplicationGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
  const [correctCount, setCorrectCount] = useState(0);
  const [stars, setStars] = useState(0);         // ⭐ (FaStar)
  const [diamonds, setDiamonds] = useState(0);    // 💎 (FaGem) - Bootstrap doesn't have a diamond icon by default
  const [emeralds, setEmeralds] = useState(0);  // 💜 (FaCreativeCommonsPdAlt as placeholder) - No direct emerald
  const [gems, setGems] = useState(0);            // 👑 (FaCrown)
  const [timer, setTimer] = useState(5);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const resetTimerAndQuestion = useCallback(() => {
    setCurrentQuestion(generateQuestion());
    setTimer(5);
  }, []);

  // Timer logic (starts after first correct answer, or always if you prefer)
  useEffect(() => {
    // Let's make timer always active for this game mode for simplicity
    // if (correctCount > 0) { // Old logic
    if (showAlert) return; // Pause timer while alert is shown

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(interval);
          setAlertMessage(`Time's up! The answer was ${currentQuestion.options.find(opt => opt.isCorrect)?.value}. Score reset.`);
          setShowAlert(true);
          setCorrectCount(0); // Reset score on time out
          // resetTimerAndQuestion(); // Now handled by alert close
          return 5; // Reset timer for next round (will be set again when alert closes)
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
    // }, [currentQuestion, correctCount, resetTimerAndQuestion, showAlert]); // Old deps
  }, [currentQuestion, showAlert]); // Simpler deps, resetTimerAndQuestion removed as it's stable if wrapped or part of alert logic


  const handleAnswer = useCallback((isCorrect) => {
    if (isCorrect) {
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
     
      if (newCorrectCount % 10 === 0) setStars(s => s + 1);
      if (newCorrectCount % 30 === 0) setDiamonds(d => d + 1);
      if (newCorrectCount % 50 === 0) setEmeralds(e => e + 1);
      if (newCorrectCount % 100 === 0) setGems(g => g + 1);
      
      resetTimerAndQuestion();
      setShowAlert(false); // Clear any existing alert
    } else {
      setAlertMessage('Oops! Wrong answer. Your score has been reset.');
      setShowAlert(true);
      setCorrectCount(0); 
      // Timer will pause due to showAlert, question resets when alert is closed
    }
    // eslint-disable-next-line
  }, [correctCount, stars, diamonds, emeralds, gems, resetTimerAndQuestion]);

  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertMessage('');
    resetTimerAndQuestion(); // Generate new question and reset timer after alert is closed
  };

  const renderRewardIcons = (count, IconComponent, colorClass, keyPrefix) => {
    let icons = [];
    for (let i = 0; i < count; i++) {
      icons.push(<IconComponent key={`${keyPrefix}-${i}`} className={`inline-block text-2xl sm:text-3xl ${colorClass} mx-1`} />);
    }
    return icons.length > 0 ? icons : <span className="text-gray-400 text-sm">(none yet)</span>;
  };
  
  return (
    // Removed NavUser and InfoNav, assuming global navigation by AppNavbar
    <div className="container mx-auto p-4 flex flex-col items-center" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
      {showAlert && (
        <BootstrapAlert 
            variant={alertMessage.includes("Time's up") ? "warning" : "danger"} 
            onClose={handleAlertClose} 
            dismissible 
            className="w-full max-w-lg fixed top-20 left-1/2 transform -translate-x-1/2 z-50 shadow-lg" // Centered alert
        >
          <BootstrapAlert.Heading>{alertMessage.includes("Time's up") ? "Time's Up!" : "Incorrect!"}</BootstrapAlert.Heading>
          <p>{alertMessage}</p>
        </BootstrapAlert>
      )}

      <MultiplicationCard
        question={currentQuestion.question}
        options={currentQuestion.options}
        onAnswer={handleAnswer}
        timer={timer}
      />
      
      <div className="mt-6 p-6 bg-white rounded-xl shadow-xl w-full max-w-lg text-center space-y-2">
        <h4 className="text-xl font-bold text-purple-600 mb-3">Your Score & Rewards!</h4>
        <p className="text-lg font-semibold text-gray-700">
          Correct Streak: <span className="text-2xl font-bold text-green-500">{correctCount}</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
                <p className="font-medium text-yellow-500">Stars</p>
                <div>{renderRewardIcons(stars, FaStar, "text-yellow-400", "star")}</div>
            </div>
            <div>
                <p className="font-medium text-blue-500">Diamonds</p>
                <div>{renderRewardIcons(diamonds, FaGem, "text-blue-400", "diamond")}</div>
            </div>
            <div>
                <p className="font-medium text-purple-500">Amethysts</p> {/* Changed Emerald to Amethyst for icon */}
                <div>{renderRewardIcons(emeralds, FaCreativeCommonsPdAlt, "text-purple-400", "emerald")}</div>
            </div>
            <div>
                <p className="font-medium text-red-500">Crowns</p>
                <div>{renderRewardIcons(gems, FaCrown, "text-red-400", "gem")}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplicationGame;