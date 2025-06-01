// src/screens/history/UserHistory.jsx
import React, { useState, useEffect, useContext,useCallback } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context/UserContext'; // Adjust path
import { StatisticContext } from '../../contexts/statistic-context/StatisticContext'; // Adjust path
import { FaSpinner, FaExclamationTriangle, FaListAlt, FaArrowLeft, FaTrashAlt } from 'react-icons/fa'; // Added FaTrashAlt

const UserHistory = () => {
  const { state: userState } = useContext(UserContext);
  const { loadStates, deleteRecord } = useContext(StatisticContext); // Get deleteRecord

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // To show loading state for a specific delete

  const fetchHistory = useCallback(() => { // Encapsulated fetch logic
    if (userState.userId && userState.token) {
      setLoading(true);
      setError(null);
      loadStates(userState.userId, userState.token)
        .then((data) => {
          setHistory(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load history:", err);
          setError("Could not load your game history. Please try again later.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userState.userId, userState.token, loadStates]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // useEffect will re-run if fetchHistory changes (it won't due to useCallback with stable deps)

  const handleDeleteRecord = async (recordId) => {
    if (!userState.userId || !userState.token || !recordId) {
        console.warn("Delete preconditions not met:", { userId: userState.userId, token: !!userState.token, recordId });
        return;
    }

    if (!window.confirm("Are you sure you want to delete this game record? This action cannot be undone.")) {
      return;
    }

    setDeletingId(recordId);
    setError(null);

    try {
      console.log(`UserHistory: Calling deleteRecord from context for ID: ${recordId}`);
      await deleteRecord(userState.userId, recordId, userState.token); // This should throw if axios fails
      
      // IMPORTANT: Only update UI if deleteRecord did NOT throw an error
      setHistory(prevHistory => prevHistory.filter(item => item.id !== recordId));
      console.log(`UserHistory: UI updated, record ${recordId} removed locally.`);
      // Optionally show a success toast/message here
    } catch (err) {
      console.error("UserHistory: Failed to delete record (error caught from context):", err.response?.data || err.message || err);
      setError(`Could not delete the record. Server message: ${err.response?.data?.error || err.message || 'Please try again.'}`);
    } finally {
      setDeletingId(null);
    }
  };
//   const handleDeleteRecord = async (recordId) => {
//     if (!userState.userId || !userState.token || !recordId) return;

//     // Confirmation dialog
//     if (!window.confirm("Are you sure you want to delete this game record? This action cannot be undone.")) {
//       return;
//     }

//     setDeletingId(recordId); // Show loading/disabled state for this item
//     setError(null); // Clear previous errors

//     try {
//       await deleteRecord(userState.userId, recordId, userState.token);
//       // Update local state to remove the item immediately for better UX
//       setHistory(prevHistory => prevHistory.filter(item => item.id !== recordId));
//       // Optionally, show a success message for a few seconds
//     } catch (err) {
//       console.error("Failed to delete record:", err);
//       setError("Could not delete the record. Please try again.");
//       // You might want to display this error more prominently or per-item
//     } finally {
//       setDeletingId(null); // Clear deleting state
//     }
//   };

  if (loading && history.length === 0) { // Show main loading only if no history is displayed yet
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-lg shadow-xl">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-xl text-gray-600">Loading your amazing game history...</p>
      </div>
    );
  }

  if (error && history.length === 0) { // Show main error only if no history is displayed
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-red-50 rounded-lg shadow-xl border border-red-200">
        <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
        <p className="text-xl text-red-700">{error}</p>
        <button onClick={fetchHistory} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Try Again
        </button>
      </div>
    );
  }
  
  // Display general error message above the list if it occurs during deletion
  if (error && history.length > 0) {
    // Simple alert for deletion errors, you can make this more sophisticated
    alert(`Error: ${error}`);
    setError(null); // Clear error after showing
  }


  if (!loading && history.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-xl">
        <FaListAlt className="text-5xl text-gray-400 mb-4 mx-auto" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Games Played Yet!</h2>
        <p className="text-gray-500 mb-6">It looks like you haven't played any games or no history is saved. Time to play!</p>
        <Link
            to="/game"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
        >
            Start a New Game
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl lg:max-w-3xl mx-auto p-6 bg-white bg-opacity-95 rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          History
        </h1>
        <Link
            to="/game"
            className="inline-flex items-center px-4 py-2 border border-blue-500 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
            <FaArrowLeft className="mr-2" /> Play New Game
        </Link>
      </div>
      
      {/* Display loading spinner overlay if general loading is true but history already has items (re-fetching) */}
      {loading && history.length > 0 && (
          <div className="text-center py-4">
              <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto" />
          </div>
      )}

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {history.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-md bg-sky-50 hover:shadow-lg transition-shadow relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <p className="text-sm text-gray-500 font-medium">
                {new Date(item.timestamp).toLocaleDateString()} - {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full mt-2 sm:mt-0
                  ${item.percentage >= 80 ? 'bg-green-100 text-green-700' : item.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}
              >
                {item.percentage}% Correct
              </span>
            </div>
            <div className="mb-1">
              <span className="font-semibold text-gray-700">Score:</span> {item.score} / {item.totalProblems}
            </div>
            {item.settings && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Settings:</span> {item.settings.numDigits}-digit, Op: {item.settings.selectedOp}, Problems: {item.settings.numProblems}
                {item.settings.timerDuration > 0 && `, Timer: ${item.settings.timerDuration}s`}
              </div>
            )}
            <button
              onClick={() => handleDeleteRecord(item.id)}
              disabled={deletingId === item.id} // Disable button while this item is being deleted
              className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              title="Delete this record"
            >
              {deletingId === item.id ? <FaSpinner className="animate-spin" /> : <FaTrashAlt size={16} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;