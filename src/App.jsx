import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Landing from "./pages/landing"; 
import NextPage from "./pages/NextPage"; 
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import ErrorHunt from "./pages/ErrorHunt"; 
// 1. IMPORT THE STORE PAGE
import Store from "./pages/Store"; 

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/next-page" element={<NextPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/error-hunt" element={<ErrorHunt />} />
          
          {/* 2. ADD THIS ROUTE */}
          <Route path="/store" element={<Store />} />
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;