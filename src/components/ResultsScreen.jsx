// src/components/ResultsScreen.jsx
import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaStar, FaRegStar, FaSadTear, FaSmileBeam, FaGrinStars } from 'react-icons/fa'; // More expressive icons

const ResultsScreen = ({ results, onPlayAgain }) => {
  // results object: { answers: [{ problem, userAnswer, isCorrect }], problems (original), settings }
  const { answers: answeredProblems } = results;

  const correctCount = answeredProblems.filter(ans => ans.isCorrect).length;
  const totalProblems = answeredProblems.length;
  const percentage = totalProblems > 0 ? Math.round((correctCount / totalProblems) * 100) : 0;

  let rating = {
    emoji: <FaSadTear className="text-4xl sm:text-5xl text-red-500" />,
    message: "Keep practicing! Every mistake is a chance to learn.",
    stars: 0,
  };

  if (percentage === 100) {
    rating = {
      emoji: <FaGrinStars className="text-4xl sm:text-5xl text-yellow-400" />,
      message: "Wow! Perfect Score! You're a Math Superstar! 🌟",
      stars: 5,
    };
  } else if (percentage >= 80) {
    rating = {
      emoji: <FaSmileBeam className="text-4xl sm:text-5xl text-green-500" />,
      message: "Excellent Job! You're doing great!",
      stars: 4,
    };
  } else if (percentage >= 60) {
    rating = {
      emoji: <FaSmileBeam className="text-4xl sm:text-5xl text-blue-500" />,
      message: "Good Work! Keep it up!",
      stars: 3,
    };
  } else if (percentage >= 40) {
    rating = {
      emoji: <FaRegStar className="text-4xl sm:text-5xl text-orange-500" />, // Using FaRegStar for a 'trying' look
      message: "Nice try! Practice makes perfect.",
      stars: 2,
    };
  } else if (totalProblems > 0) { // Avoid this message if no problems were there
     rating.stars = 1;
  }

  // Sound effects based on score
  useEffect(() => {
    const playSound = (soundId) => {
      const sound = document.getElementById(soundId);
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.warn("Error playing sound:", error));
      }
    };

    if (rating.stars >= 4) {
      playSound('level-complete-sound');
      setTimeout(() => playSound('star-sound'), 300);
    } else if (rating.stars >= 2) {
      // playSound('medium-score-sound'); // if you have one
    } else if (totalProblems > 0) {
      // playSound('try-again-sound'); // if you have one
    }
  }, [rating.stars, totalProblems]);


  const renderStars = (count) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < count) {
        stars.push(<FaStar key={`star-${i}`} className="text-yellow-400 text-2xl sm:text-3xl" />);
      } else {
        stars.push(<FaRegStar key={`empty-star-${i}`} className="text-gray-300 text-2xl sm:text-3xl" />);
      }
    }
    return <div className="flex justify-center gap-1 mt-2 mb-4">{stars}</div>;
  };

  return (
    <div className="w-full max-w-xl lg:max-w-2xl mx-auto p-6 sm:p-8 bg-white bg-opacity-95 rounded-xl shadow-2xl text-center">
      <div className="mb-6">
        {rating.emoji}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          {percentage === 100 ? "Amazing!" : "Quiz Complete!"}
        </h2>
        {renderStars(rating.stars)}
        <p className="text-lg sm:text-xl text-gray-700">
          You got <strong className="text-green-600">{correctCount}</strong> out of <strong className="text-blue-600">{totalProblems}</strong> correct ({percentage}%).
        </p>
        <p className="text-md text-gray-600 mt-2">{rating.message}</p>
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 border-t pt-4 mt-6">Detailed Review:</h3>
      <div className="space-y-3 max-h-[40vh] sm:max-h-[50vh] overflow-y-auto pr-2 text-left border rounded-lg p-4 bg-gray-50 shadow-inner">
        {answeredProblems.map((ans, index) => (
          <div
            key={ans.problem.id || index} // Use problem.id if available
            className={`p-3 rounded-lg shadow-sm border-l-4 ${
              ans.isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm sm:text-base font-semibold text-gray-500">Problem {index + 1}</span>
              {ans.isCorrect ? (
                <FaCheckCircle className="text-green-500 text-xl sm:text-2xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl sm:text-2xl" />
              )}
            </div>
            <p className="text-lg sm:text-xl font-medium text-gray-800">
              {ans.problem.text} = ?
            </p>
            <p className={`text-sm sm:text-base ${ans.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              Your answer: <strong className="font-bold">{ans.userAnswer === null ? 'Not answered' : ans.userAnswer}</strong>
            </p>
            {!ans.isCorrect && (
              <p className="text-sm sm:text-base text-blue-600 font-semibold">
                Correct answer: <strong className="font-bold">{ans.problem.answer}</strong>
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        className="mt-8 w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:shadow-lg transition duration-150 transform hover:scale-105"
      >
        Play Again!
      </button>
      {/* Audio elements for result sounds - can be here or in App.js, ensure IDs are unique if duplicated */}
      <audio id="star-sound" src="/sounds/star.mp3" preload="auto"></audio>
      {/* level-complete-sound is likely already in GameScreen or App.js */}
    </div>
  );
};

export default ResultsScreen;