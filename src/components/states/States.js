import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col, FormCheck, Button } from "react-bootstrap";
import NavUser from "../nav-user/NavUser";
import InfoNav from "../info-nav/InfoNav";
import "./States.css";
import { StatisticContext } from "../../contexts/statistic-context/StatisticContext";

export default function States() {
  const { loadStates, deleteRecord } = useContext(StatisticContext);
  const [loadedStates, setLoadedStates] = useState([]);
  const [userIdExists, setUserIdExists] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState(new Set());
  const [visibilityStates, setVisibilityStates] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectRecord = (recordId) => {
    setSelectedRecords((prevSelectedRecords) => {
      const newSelection = new Set(prevSelectedRecords);
      if (newSelection.has(recordId)) {
        newSelection.delete(recordId);
        setVisibilityStates((prevStates) => ({
          ...prevStates,
          [recordId]: { showButton: false, showText: false }, // Hide button if unselected
        }));
      } else {
        newSelection.add(recordId);
        setVisibilityStates((prevStates) => ({
          ...prevStates,
          [recordId]: { showButton: true, showText: false }, // Show button if selected
        }));
      }
      return newSelection;
    });
  };

  const handleSelectAllRecords = (selectAll) => {
    setSelectAllChecked(selectAll); // Update the select all state
    if (selectAll) {
      setSelectedRecords(new Set(loadedStates.map((state) => state.id)));
      const updatedVisibility = loadedStates.reduce((acc, state) => {
        acc[state.id] = { showButton: true, showText: false };
        return acc;
      }, {});
      setVisibilityStates(updatedVisibility);
    } else {
      setSelectedRecords(new Set());
      setVisibilityStates({});
    }
  };

  const handleDeleteSelected = (recordId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // If a specific record ID is provided, delete only that record
    if (recordId) {
      deleteRecord(userId, recordId, token)
        .then(() => {
          setLoadedStates((currentLoadedStates) =>
            currentLoadedStates.filter((state) => state.id !== recordId)
          );
          setSelectedRecords((prevSelectedRecords) => {
            const newSelection = new Set(prevSelectedRecords);
            newSelection.delete(recordId);
            return newSelection;
          });
          setVisibilityStates((prevStates) => ({
            ...prevStates,
            [recordId]: { showButton: false, showText: true }, // Show text after delete
          }));
        })
        .catch((error) => {
          console.error("Error deleting record:", error);
          // Optionally handle the error in the UI
        });
    }
    // If no specific record ID is provided, delete all selected records
    else {
      const deletePromises = Array.from(selectedRecords).map((id) =>
        deleteRecord(userId, id, token)
      );

      Promise.all(deletePromises)
        .then(() => {
          setLoadedStates((currentLoadedStates) =>
            currentLoadedStates.filter(
              (state) => !selectedRecords.has(state.id)
            )
          );
          setSelectedRecords(new Set());
          setVisibilityStates({});
        })
        .catch((error) => {
          console.error("Error deleting records:", error);
          // Optionally handle the error in the UI
        });
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId) {
      setUserIdExists(true);
      loadStates(userId, token)
        .then((fetchedStates) => {
          setLoadedStates(fetchedStates);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
    // eslint-disable-next-line
  }, []);

  const convertRateToGrade = (rate) => {
    const gradeStyle = {
      color: "", // default color
      emoji: "🥵", // default emoji for F grade
    };

    if (rate >= 90) {
      gradeStyle.color = "green";
      gradeStyle.emoji = "🌟"; // Star for A+
    } else if (rate >= 85) {
      gradeStyle.color = "limegreen";
      gradeStyle.emoji = "😊"; // Smiling face for A
    } else if (rate >= 80) {
      gradeStyle.color = "lightgreen";
      gradeStyle.emoji = "😀"; // Happy face for A-
    } else if (rate >= 75) {
      gradeStyle.color = "yellowgreen";
      gradeStyle.emoji = "👍"; // Thumbs up for B+
    } else if (rate >= 70) {
      gradeStyle.color = "yellow";
      gradeStyle.emoji = "😄"; // Grinning face for B
    } else if (rate >= 65) {
      gradeStyle.color = "gold";
      gradeStyle.emoji = "😌"; // Relieved face for B-
    } else if (rate >= 60) {
      gradeStyle.color = "orange";
      gradeStyle.emoji = "🙂"; // Slightly smiling face for C+
    } else if (rate >= 55) {
      gradeStyle.color = "darkorange";
      gradeStyle.emoji = "😐"; // Neutral face for C
    } else if (rate >= 50) {
      gradeStyle.color = "orangered";
      gradeStyle.emoji = "😶"; // Expressionless face for C-
    } else if (rate >= 45) {
      gradeStyle.color = "red";
      gradeStyle.emoji = "🙁"; // Slightly frowning face for D+
    } else if (rate >= 40) {
      gradeStyle.color = "darkred";
      gradeStyle.emoji = "☹️"; // Frowning face for D
    } else if (rate >= 35) {
      gradeStyle.color = "maroon";
      gradeStyle.emoji = "😦"; // Frowning face with open mouth for D-
    }

    return (
      <span style={{ color: gradeStyle.color }}>
        {gradeStyle.emoji} {rate >= 35 ? `Grade ${rate}%` : "F"}
      </span>
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes and ${remainingSeconds} seconds`;
  };

  return (
    <div>
      <NavUser />
      <InfoNav />
      <Container className="mt-4">
        {userIdExists ? (
          loadedStates.length > 0 ? (
            <>
              <Row>
              <Col xs={12} className="mb-2 top-left-controls">
    <div className="form-check-container">
      <FormCheck
        checked={selectAllChecked}
        onChange={(e) => handleSelectAllRecords(e.target.checked)}
      />
      <span className={selectAllChecked ? "d-none" : ""}>Select All</span>
                  {selectAllChecked && (
                    <Button
                      onClick={() => handleDeleteSelected()}
                      variant="danger"
                    >
                      Delete All
                    </Button>
                  )}</div>
                </Col>
              </Row>
              <Row className="justify-content-center">
                {loadedStates.map((state) => (
                  <Col key={state.id} md={6} lg={4} className="mb-4">
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          {state.grade}: level-{state.level}{" "}
                          {state.type === "sub"
                            ? "Subtraction"
                            : state.type === "mul"
                            ? "Multiplication"
                            : state.type === "div"
                            ? "Division"
                            : "Addition"}
                        </Card.Title>
                        <div className="card-top-left">
                          <FormCheck
                            checked={selectedRecords.has(state.id)}
                            onChange={() => handleSelectRecord(state.id)}
                          />
                          {visibilityStates[state.id]?.showButton && (
                            <Button
                              onClick={() => handleDeleteSelected(state.id)}
                              variant="danger"
                            >
                              X
                            </Button>
                          )}
                          {visibilityStates[state.id]?.showText && (
                            <span>Select All</span>
                          )}
                        </div>
                        <Card.Text>
                          You got: {convertRateToGrade(state.rate)}
                        </Card.Text>
                        <Card.Text>
                          Time left: {formatTime(state.time)}
                        </Card.Text>
                        <Card.Text>
                          {state.localTime} {state.date}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <Row className="justify-content-center">
              <Col xs={12} className="text-center">
                <p>No records found or an error occurred.</p>
              </Col>
            </Row>
          )
        ) : (
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <p>Please login or sign up to view your records.</p>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
