// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { UserContext } from './contexts/user-context/UserContext'; 
import AppNavbar from './components/Navbar'; // Your Navbar
import SignUpScreen from './screens/sign-up/SignUp';
import LoginScreen from './screens/login/Login';
import MainDashboard from './screens/dashboard/MainDashboard'; // <<< IMPORT NEW DASHBOARD
import UserHistory from './screens/history/UserHistory'; 

const ProtectedRoute = ({ children }) => {
  const { state: userState } = useContext(UserContext);
  if (!userState.token || !userState.userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { state: userState } = useContext(UserContext);
  if (userState.token && userState.userId) {
    return <Navigate to="/app" replace />; // <<< Default to /app if logged in
  }
  return children;
};

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-sky-100"> {/* Example global background */}
      <AppNavbar />
      <main className="flex-grow w-full"> {/* Changed container to allow MainDashboard to control its own width constraints */}
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
            path="/app"  // <<< MAIN AUTHENTICATED ROUTE
            element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <UserHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <RootRedirector redirectTo="/app" /> // <<< Redirect to /app
            }
          />
          {/* Old /game route, redirect to /app for safety if any old links exist */}
          <Route path="/game" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} /> 
        </Routes>
      </MainLayout>
    </Router>
  );
}

const RootRedirector = ({ redirectTo = "/app" }) => { // <<< Updated default redirect
  const { state: userState } = useContext(UserContext);
  return (userState.token && userState.userId) ? <Navigate to={redirectTo} replace /> : <Navigate to="/login" replace />;
};

export default App;