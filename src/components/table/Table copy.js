import React, { useEffect } from "react";
import "./table.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Table({
  randomNums,
  activeAnswerIndex,
  operationType,
  correctlyAnswered,
}) {
  useEffect(() => {}, [operationType]); // Dependency array includes operationType
  // Check if randomNums is defined and has elements
  if (!randomNums || randomNums.length === 0) {
    return <div>No problems to display</div>;
  }

  // Divide randomNums into groups of 10
  const groupedRandomNums = [];
  for (let i = 0; i < randomNums.length; i += 10) {
    groupedRandomNums.push(randomNums.slice(i, i + 10));
  }

  // Determine the operation symbol based on the operationType
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
        {groupedRandomNums.map((group, groupIndex) => (
          // Adjust the classes for responsive column sizing
          <div key={groupIndex} className="col-12 col-md-6 col-lg-4 mb-3">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Answer</th>
                </tr>
              </thead>
              <tbody>
                {group.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      activeAnswerIndex === groupIndex * 10 + rowIndex
                        ? "active-cell"
                        : ""
                    }
                  >
                    <td>{`${row.var1} ${operationSymbol} ${row.var2}`}</td>
                    <td>
                      {correctlyAnswered.has(groupIndex * 10 + rowIndex)
                        ? row.answer
                        : "="}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Table;
