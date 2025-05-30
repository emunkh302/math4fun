// import React, { createContext, useReducer } from 'react';
// import axios from 'axios';

// export const UserContext = createContext();
// const API_KEY = process.env.REACT_APP_WEB_API_KEY;

// const initialState = {
//   saving: false,
//   loggingIn: false,
//   error: null,
//   token: null,
//   userId: null,
//   expireDate: null,
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'LOGIN_SUCCESS':
//       return {
//         ...state,
//         loggingIn: false,
//         error: null,
//         token: action.payload.token,
//         userId: action.payload.userId,
//         expireDate: action.payload.expireDate,
//       };
//     case 'LOGIN_FAIL':
//       return {
//         ...state,
//         loggingIn: false,
//         error: action.payload.error,
//         token: null,
//         userId: null,
//         expireDate: null,
//       };
//     case 'LOGOUT':
//       return {
//         ...state,
//         token: null,
//         userId: null,
//         expireDate: null,
//       };
//     case 'START_LOGIN':
//       return {
//         ...state,
//         loggingIn: true,
//         error: null,
//       };
//     case 'START_SIGNUP':
//       return {
//         ...state,
//         saving: true,
//         error: null,
//       };
//     case 'SIGNUP_SUCCESS':
//       return {
//         ...state,
//         saving: false,
//         error: null,
//       };
//     case 'SIGNUP_FAIL':
//       return {
//         ...state,
//         saving: false,
//         error: action.payload.error,
//       };
//     default:
//       return state;
//   }
// };


//  const UserStore = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const loginUser = async (email, password) => {
//     dispatch({ type: 'START_LOGIN' });
//     try {
//       const response = await axios.post(
//         `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
//         { email, password, returnSecureToken: true }
//       );
//       const { idToken, localId, expiresIn } = response.data;
//       const expireDate = new Date(new Date().getTime() + expiresIn * 1000);

//       // Store token in local storage or handle it the way you prefer
//       localStorage.setItem("token", idToken);
//       localStorage.setItem("userId", localId);
//       localStorage.setItem("expireDate", expireDate);

//       dispatch({ type: 'LOGIN_SUCCESS', payload: { token: idToken, userId: localId, expireDate } });
//     } catch (error) {
//       dispatch({ type: 'LOGIN_FAIL', payload: { error: error.response.data.error.message } });
//     }
//   };

//   const logout = () => {
//     // Clear local storage or any other cleanup
//     localStorage.removeItem("token");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("expireDate");

//     dispatch({ type: 'LOGOUT' });
//   };

//   const signupUser = async (email, password) => {
//     dispatch({ type: 'START_SIGNUP' });
//     try {
//       const response = await axios.post(
//         `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
//         { email, password, returnSecureToken: true }
//       );
  
//       // Example: Extract data from the response
//       const { idToken, localId, expiresIn } = response.data;
//       const expireDate = new Date(new Date().getTime() + expiresIn * 1000);
  
//       // Store the token and other relevant data in localStorage
//       localStorage.setItem("token", idToken);
//       localStorage.setItem("userId", localId);
//       localStorage.setItem("expireDate", expireDate);
  
//       // Dispatch success action with payload if needed
//       dispatch({ type: 'SIGNUP_SUCCESS', payload: { token: idToken, userId: localId, expireDate } });
  
//       // You might want to auto-login the user or navigate to another page here
//     } catch (error) {
//       dispatch({ type: 'SIGNUP_FAIL', payload: { error: error.response.data.error.message } });
//     }
//   };
  

//   const autoRenewToken = async () => {
//     try {
//       const response = await axios.post(
//         `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
//         { grant_type: "refresh_token", refresh_token: localStorage.getItem("refreshToken") }
//       );
//       localStorage.setItem("token", response.data.id_token);
//     localStorage.setItem("refreshToken", response.data.refresh_token);
//     } catch (error) {
//       // Handle error
//     }
//   };

//   return (
//     <UserContext.Provider value={{ state, loginUser, logout, signupUser, autoRenewToken }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserStore;

// src/contexts/user-context/UserContext.js
import React, { createContext, useReducer, useEffect } from 'react'; // Added useEffect
import axios from 'axios';

export const UserContext = createContext();
const API_KEY = process.env.REACT_APP_WEB_API_KEY;

const initialState = {
  saving: false,
  loggingIn: false,
  error: null,
  token: null,
  userId: null,
  expireDate: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loggingIn: false,
        error: null,
        token: action.payload.token,
        userId: action.payload.userId,
        expireDate: action.payload.expireDate,
      };
    case 'LOGIN_FAIL':
      return {
        ...state,
        loggingIn: false,
        error: action.payload.error,
        token: null,
        userId: null,
        expireDate: null,
      };
    case 'LOGOUT':
      return {
        ...initialState, // Reset to initial state on logout
      };
    case 'START_LOGIN':
      return {
        ...state,
        loggingIn: true,
        error: null,
      };
    case 'START_SIGNUP':
      return {
        ...state,
        saving: true,
        error: null,
      };
    case 'SIGNUP_SUCCESS': // Ensure this also sets token, userId, expireDate if auto-logging in after signup
      return {
        ...state,
        saving: false,
        error: null,
        token: action.payload.token, // Assuming payload contains these after signup
        userId: action.payload.userId,
        expireDate: action.payload.expireDate,
      };
    case 'SIGNUP_FAIL':
      return {
        ...state,
        saving: false,
        error: action.payload.error,
      };
    case 'AUTO_LOGIN_SUCCESS': // New action type for rehydration
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        expireDate: action.payload.expireDate,
      };
    default:
      return state;
  }
};

const UserStore = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Auto-login effect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const expireDateString = localStorage.getItem("expireDate");

    if (token && userId && expireDateString) {
      const expireDate = new Date(expireDateString);
      if (expireDate > new Date()) {
        // Token is still valid
        dispatch({ type: 'AUTO_LOGIN_SUCCESS', payload: { token, userId, expireDate } });
        // Optionally, you might want to set a timer here to auto-logout when token expires
        // or implement token auto-renewal logic if you have it.
      } else {
        // Token expired, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expireDate");
        // Potentially dispatch a logout action or clear state
      }
    }
  }, []); // Empty dependency array ensures this runs once on mount


  const loginUser = async (email, password) => {
    dispatch({ type: 'START_LOGIN' });
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
        { email, password, returnSecureToken: true }
      );
      const { idToken, localId, expiresIn } = response.data;
      const expireDate = new Date(new Date().getTime() + expiresIn * 1000);

      localStorage.setItem("token", idToken);
      localStorage.setItem("userId", localId);
      localStorage.setItem("expireDate", expireDate.toISOString()); // Store as ISO string

      dispatch({ type: 'LOGIN_SUCCESS', payload: { token: idToken, userId: localId, expireDate } });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || "Login failed. Please try again.";
      dispatch({ type: 'LOGIN_FAIL', payload: { error: errorMessage } });
      throw new Error(errorMessage); // Re-throw for component to catch if needed
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expireDate");
    // Potentially remove refreshToken if you implement that
    dispatch({ type: 'LOGOUT' });
  };

  const signupUser = async (email, password) => {
    dispatch({ type: 'START_SIGNUP' });
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        { email, password, returnSecureToken: true }
      );
      const { idToken, localId, expiresIn } = response.data;
      const expireDate = new Date(new Date().getTime() + expiresIn * 1000);

      localStorage.setItem("token", idToken);
      localStorage.setItem("userId", localId);
      localStorage.setItem("expireDate", expireDate.toISOString()); // Store as ISO string
      
      // Auto-login after signup by dispatching success with user data
      dispatch({ type: 'SIGNUP_SUCCESS', payload: { token: idToken, userId: localId, expireDate } });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || "Signup failed. Please try again.";
      dispatch({ type: 'SIGNUP_FAIL', payload: { error: errorMessage } });
      throw new Error(errorMessage); // Re-throw for component to catch if needed
    }
  };
  
  // autoRenewToken logic can remain if you plan to use refresh tokens

  return (
    <UserContext.Provider value={{ state, loginUser, logout, signupUser /*, autoRenewToken */ }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserStore;