import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SuperAdminDashboard from "./components/SuperAdminDashboard";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve token & role from localStorage on page load
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsLoggedIn(true);
      setUser({ role });
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);

    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                user.role === "SuperAdmin" ? (
                  <Navigate to="/superadmin-dashboard" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/superadmin-dashboard"
            element={isLoggedIn && user.role === "SuperAdmin" ? <SuperAdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />}
          />
  
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;



// import React from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
// import Login from "./components/Login4";
// import Dashboard from "./components/Dashboard";

// const App = () => {
//     const isAuthenticated = localStorage.getItem("token"); // Check if user is logged in

//     return (
//         <Router>
//             <Routes>
//                 {/* Public Route */}
//                 <Route path="/login" element={<Login />} />
                
//                 {/* Private Route: Redirects to login if not authenticated */}
//                 <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                
//                 {/* Default Route: Redirect to Login */}
//                 <Route path="*" element={<Navigate to="/login" />} />
//             </Routes>
//         </Router>
//     );
// };

// export default App;
