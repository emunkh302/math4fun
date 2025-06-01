// src/components/flash-card/FlashCard.js
import React from 'react';

// Using existing props: question, options, onAnswer, timer
const MultiplicationCard = ({ question, options, onAnswer, timer }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6 rounded-xl shadow-2xl text-white">
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Multiplication Challenge!</h3>
          <div 
            className={`timer-countdown text-2xl font-bold bg-white text-purple-600 px-3 py-1 rounded-full shadow-md ${timer <= 2 ? 'low-time animate-pulse' : ''}`}
            aria-live="polite" // Announces changes to screen readers
          >
            {timer}
          </div>
        </div>

        <div className="bg-white text-gray-800 p-8 rounded-lg shadow-inner min-h-[120px] flex items-center justify-center mb-6">
          <h5 className="text-3xl sm:text-4xl font-bold select-none">
            {question}
          </h5>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {options.map((option, index) => (
            <button
              key={index}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-4 rounded-lg shadow-md text-lg sm:text-xl
                         transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              onClick={() => onAnswer(option.isCorrect)}
            >
              {option.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiplicationCard;