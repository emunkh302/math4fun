import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function GameTimer({ timer }) {  
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="mt-3">
      <h4>Time left: 
        <span className={`badge ${timer <= 10 ? 'bg-danger' : 'bg-secondary'}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </h4>
    </div>
  );
}
