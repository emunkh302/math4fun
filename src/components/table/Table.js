import React, { useState, useEffect } from "react";
import "./table.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Table = React.memo(({
  randomNums,
  activeAnswerIndex,
  operationType,
  correctlyAnswered,
  activeCellRef,
  message
}) => {

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let timer;  
    if (message) {
      setShowMessage(true);
      timer = setTimeout(() => {
        setShowMessage(false);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [message]);

  useEffect(() => {}, [operationType]);

  if (!randomNums || randomNums.length === 0) {
    return <div>No problems to display</div>;
  }

  const groupedRandomNums = [];
  for (let i = 0; i < randomNums.length; i += 10) {
    groupedRandomNums.push(randomNums.slice(i, i + 10));
  }

  const operationSymbols = {
    add: "+",
    sub: "-",
    mul: "*",
    div: "/",
  };
  const operationSymbol = operationSymbols[operationType] || "+";

  return (
    <div className="container mt-3">
      <div className="row">
        {groupedRandomNums.length === 0 ? (
          <div className="col-12 text-center">No problems to display</div>
        ) : (
          groupedRandomNums.map((group, groupIndex) => (
            <div key={groupIndex} className="table-container col-12 col-md-6 col-lg-4 mb-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {group.map((row, rowIndex) => {
                    const isRowActive = activeAnswerIndex === groupIndex * 10 + rowIndex;
                    return (
                      <tr
                        key={rowIndex}
                        ref={isRowActive ? activeCellRef : null}
                        className={isRowActive ? "active-cell" : ""}
                      >
                        <td>{`${row.var1} ${operationSymbol} ${row.var2}`}</td>
                        <td>
                          {correctlyAnswered.has(groupIndex * 10 + rowIndex) ? row.answer : "="}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {showMessage && <div className="table-message">{message}</div>}
            </div>
          ))
        )}
        
      </div>      
    </div>
  );
  
  
                })

export default Table;
