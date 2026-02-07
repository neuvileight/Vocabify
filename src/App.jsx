import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import all your pages
import Landing from "./pages/landing"; 
import NextPage from "./pages/NextPage";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import ErrorHunt from "./pages/ErrorHunt"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing Page (Start Here) */}
        <Route path="/" element={<Landing />} />
        
        {/* The Setup Page */}
        <Route path="/next-page" element={<NextPage />} />
        
        {/* The Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* The Profile Page */}
        <Route path="/profile" element={<MyProfile />} />
        
        {/* The New Game: Error Hunt */}
        <Route path="/error-hunt" element={<ErrorHunt />} />
      </Routes>
    </Router>
  );
}

export default App;