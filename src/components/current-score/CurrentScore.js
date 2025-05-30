import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import Bootstrap CSS

export default function CurrentScore({ score }) {
  return (
    <div className="mt-3">
      <h4>SCORE: <span className="badge bg-primary">{score}</span></h4>
    </div>
  );
}
