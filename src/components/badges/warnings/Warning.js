import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import './Warning.css';

export default function Warning({ score }) {
  const [showBadge, setShowBadge] = useState(false);

  const encouragementWords = [
    "Good", "Cool", "Excellent", "Good Job", "Go Go", 
    "Wow", "You Are Genius", "You Did It"
  ];

  const getEncouragementWord = () => {
    const randomIndex = Math.floor(Math.random() * encouragementWords.length);
    return encouragementWords[randomIndex];
  };

  useEffect(() => {
    if (score % 5 === 0 && score !== 0) {
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 1000);
    }
  }, [score]);

  const wordToShow = getEncouragementWord();

  return (
    <div className="container">
      {showBadge && (
        <Alert className="popUpBadge popUpAndOut">
          {wordToShow}
        </Alert>
      )}
    </div>
  );
}
