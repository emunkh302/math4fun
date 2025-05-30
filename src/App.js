// src/App.js (Showing relevant routing parts)
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { UserContext } from './contexts/user-context/UserContext'; 
// ... other imports from your App.js ...
import AppNavbar from './components/Navbar'; // Your Navbar
import SignUpScreen from './screens/sign-up/SignUp';
import LoginScreen from './screens/login/Login';
import GamePage from './screens/game/GamePage';
import UserHistory from './screens/history/UserHistory'; // <<< IMPORT NEW HISTORY SCREEN

const ProtectedRoute = ({ children }) => {
  const { state: userState } = useContext(UserContext);
  if (!userState.token || !userState.userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  // ... (as defined before)
  const { state: userState } = useContext(UserContext);
  if (userState.token && userState.userId) {
    return <Navigate to="/game" replace />; 
  }
  return children;
};

function MainLayout({ children }) {
  // ... (as defined before)
  return (
    <div className="min-h-screen flex flex-col bg-sky-100">
      <AppNavbar />
      <main className="flex-grow container mx-auto py-4 sm:py-6 px-2 sm:px-4">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUpScreen /></PublicRoute>} />
          <Route 
            path="/game" 
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" // <<< NEW ROUTE FOR HISTORY
            element={
              <ProtectedRoute>
                <UserHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <RootRedirector />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} /> 
        </Routes>
      </MainLayout>
    </Router>
  );
}

const RootRedirector = () => {
  // ... (as defined before)
  const { state: userState } = useContext(UserContext);
  return (userState.token && userState.userId) ? <Navigate to="/game" replace /> : <Navigate to="/login" replace />;
};

export default App;