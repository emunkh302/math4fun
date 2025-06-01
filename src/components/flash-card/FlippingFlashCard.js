// src/components/flash-card/FlippingFlashCard.jsx (New or correctly named file)
import React, { useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa'; // Icon for flip hint

const FlippingFlashCard = ({ question, answer, topic = "Topic" }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    const flipSound = document.getElementById('flip-sound');
    if (flipSound) {
      flipSound.currentTime = 0;
      flipSound.play().catch(e => console.warn("Flip sound error", e));
    }
  };

  return (
    <div
      className={`flashcard-container w-full max-w-md h-64 sm:h-72 mx-auto cursor-pointer rounded-lg ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === ' ' || e.key === 'Enter' ? handleFlip() : null}
      title="Click to flip"
    >
      <div className="flashcard-inner rounded-lg">
        {/* Front of the Card (Question) */}
        <div className="flashcard-front bg-gradient-to-br from-sky-400 to-blue-500 text-white p-6">
          <div className="absolute top-2 left-2 text-xs bg-black bg-opacity-20 px-2 py-1 rounded">
            {topic}
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold break-words"> {/* Adjusted font size for potentially longer questions */}
            {question}
          </div>
          <div className="absolute bottom-3 right-3 text-sm opacity-70 flex items-center">
            <FaSyncAlt className="mr-1" /> Click to flip
          </div>
        </div>

        {/* Back of the Card (Answer) */}
        <div className="flashcard-back bg-gradient-to-br from-green-400 to-emerald-500 text-white p-6">
          <div className="absolute top-2 left-2 text-xs bg-black bg-opacity-20 px-2 py-1 rounded">
            Answer
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold break-words">  {/* Adjusted font size */}
            {answer}
          </div>
          <div className="absolute bottom-3 right-3 text-sm opacity-70 flex items-center">
            <FaSyncAlt className="mr-1" /> Click to flip
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippingFlashCard;