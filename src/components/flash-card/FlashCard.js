import React from "react";
import "./FlashCard.css";

const FlashCard = ({ question, options, onAnswer, timer }) => {
  return (
    <div className="card text-center">
      <div className="card-header">Multiplication Quiz</div>
      <div className="card-body">
        <h5 className="card-title">
          {question}
          <div className={`spinner ${timer === 5 ? "reset" : ""}`}>
            <span className="timer-text">{timer}</span>
          </div>
        </h5>
        <div>
          {options.map((option, index) => (
            <button
              key={index}
              className="btn btn-primary m-2"
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

export default FlashCard;
