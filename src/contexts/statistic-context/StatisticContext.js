// src/contexts/statistic-context/StatisticContext.js
import React, { createContext, useState, useCallback } from "react";
// Removed: import axios from "../../screens/axios-states"; // We'll use fetch for this test

export const StatisticContext = createContext();

const StatisticStore = ({ children }) => {
  const [internalState, setInternalState] = useState({});
  const [fetchedStatesData, setFetchedStatesData] = useState({ states: [], loading: false, error: null });

  // saveState can still use your axios instance if it's working for POSTs
  const saveState = useCallback(async (newState, token) => {
    // Temporarily import axios here if you need it, or ensure your axios-states.js is still imported
    // For this example, assuming axios for saveState still works
    const axios = (await import("../../screens/axios-states")).default; 

    setInternalState(prevState => ({ ...prevState, saving: true, finished: false, error: null }));
    try {
      const response = await axios.post(`states.json?auth=${token}`, newState);
      setInternalState(prevState => ({ ...prevState, saving: false, finished: true, error: null }));
      return response;
    } catch (error) {
      setInternalState(prevState => ({ ...prevState, saving: false, finished: true, error }));
      return Promise.reject(error);
    }
  }, []);

  const loadStates = useCallback(async (userId, token) => {
    setFetchedStatesData(prevData => ({ ...prevData, loading: true, error: null }));
    
    // --- Using fetch API for this test ---
    // For testing a single record:
    // const recordId = "-ORTbqST4qOuVMgxb3YU"; // Use an actual ID from your DB
    // const queryUrl = `https://math4jem-default-rtdb.firebaseio.com/states/${recordId}.json?auth=${token}`;

    // For testing with the original query:
    const queryUrl = `https://math4jem-default-rtdb.firebaseio.com/states.json?auth=${token}&orderBy="userId"&equalTo="${userId}"`;


    console.log("Fetching from URL (using fetch):", queryUrl);

    try {
      const response = await fetch(queryUrl);
      console.log("Fetch response status:", response.status, response.statusText);

      if (!response.ok) {
        // Try to get error message from response if possible
        let errorData;
        try {
            errorData = await response.json(); // Firebase often returns JSON error objects
        } catch (e) {
            // If response is not JSON
            errorData = { message: response.statusText };
        }
        console.error("Fetch error response data:", errorData);
        throw new Error(errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`);
      }

      const fetchedData = await response.json();
      console.log("Fetched data (using fetch):", fetchedData);

      const statesArray = fetchedData
        ? Object.keys(fetchedData)
            .reverse()
            .map((key) => ({
              ...(typeof fetchedData[key] === 'object' ? fetchedData[key] : { value: fetchedData[key] }), // Handle if single record fetch returns value directly
              id: key,
            }))
        : [];
      
      // If fetching a single record directly, fetchedData might not be an object to map with Object.keys
      // Adjust accordingly if you are testing with a direct path to a record.
      // Example for single record:
      // const statesArray = fetchedData ? [{ ...fetchedData, id: recordId }] : [];


      setFetchedStatesData({ states: statesArray, loading: false, error: null });
      return statesArray;
    } catch (error) {
      console.error("Error loading states with fetch:", error);
      // Use error.message if available, otherwise provide a generic message
      const errorMessage = error.message || "Network request failed using fetch.";
      setFetchedStatesData({ states: [], loading: false, error: new Error(errorMessage) }); // Store error object
      return Promise.reject(new Error(errorMessage));
    }
  }, []);

  const deleteRecord = useCallback(async (userId, recordId = null, token) => {
    // Make sure your configured axios instance is used, e.g., imported at the top
    // For this example, dynamically importing, but you likely have it imported already
    const axiosInstance = (await import("../../screens/axios-states")).default;


    // setState(prevState => ({ ...prevState, deleting: true, error: null })); // Use a more specific state for this context if needed
    console.log(`Attempting to delete recordId: ${recordId} for userId: ${userId}`);

    if (!recordId) { // Handling "delete all" path
        console.log("Delete all for user initiated. Fetching records...");
        // Your existing logic for deleting all records for a user:
        // You'll need to ensure your axiosInstance is available here too.
        const deleteUrl = `states.json?auth=${token}`; // Base URL from your axios instance
        try {
            const response = await axiosInstance.get(`${deleteUrl}&orderBy="userId"&equalTo="${userId}"`);
            const records = response.data;
            if (!records || Object.keys(records).length === 0) {
                console.log("No records found to delete for this user.");
                // setState(prevState => ({ ...prevState, deleting: false, finished: true, error: null }));
                return; // Or resolve promise
            }
            const deletePromises = Object.keys(records).map((key) => {
                console.log(`Deleting record by key during 'delete all': ${key}`);
                return axiosInstance.delete(`states/${key}.json?auth=${token}`);
            });
            await Promise.all(deletePromises);
            console.log("All user records deletion attempted.");
            // setState(prevState => ({ ...prevState, deleting: false, finished: true, error: null }));
            return; // Indicate success or resolve promise
        } catch (error) {
            console.error("Error during 'delete all' records in StatisticContext:", error.response?.data || error.message || error);
            // setState(prevState => ({ ...prevState, deleting: false, error }));
            throw error; // Re-throw to be caught by UserHistory
        }
    }

    // Logic for deleting a single record by ID
    try {
      const response = await axiosInstance.delete(`states/${recordId}.json?auth=${token}`);
      console.log('Axios delete response for single record:', response.status, response.data); // Log status and data
      // setState(prevState => ({ ...prevState, deleting: false, finished: true, error: null }));
      // For delete, Firebase returns 204 No Content (response.data will be null or empty)
      // No need to explicitly return here unless you want to pass response status or data
    } catch (error) {
      console.error("AXIOS DELETE ERROR in StatisticContext (single record):", error.response?.data || error.message || error);
      // setState(prevState => ({ ...prevState, deleting: false, error }));
      throw error; // Re-throw the error so UserHistory.jsx can catch it
    }
  }, []); // Add dependencies if axiosInstance or other external vars are used and can change

  return (
    <StatisticContext.Provider value={{ saveState, loadStates, deleteRecord, fetchedStatesData, internalState }}>
      {children}
    </StatisticContext.Provider>
  );
};

export default StatisticStore;