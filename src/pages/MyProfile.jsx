import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyProfile.module.css";
import { useTheme } from "../context/ThemeContext";

const MyProfile = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // --- STATE ---
  const [formData, setFormData] = useState({
    name: "Explorer",
    email: "explorer@vocabify.com",
    dob: "2010-01-01",
  });

  const [stats, setStats] = useState({
    currency: 0,
    bestStreak: 0,
  });

  // --- LOAD DATA ---
  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setFormData(JSON.parse(storedUser));
    }

    const currency = localStorage.getItem("userCurrency") || 0;
    setStats({
      currency: parseInt(currency),
      bestStreak: 5, 
    });
  }, []);

  // --- AGE CALCULATOR ---
  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(formData));
    alert("Profile Updated Successfully!");
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      
      {/* NAVBAR */}
      <nav className={styles.navBar}>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </nav>

      {/* --- CSS STEALTH JET (TOP RIGHT) --- */}
      <div className={styles.mascotContainer}>
        <div className={styles.stealthJet}>
          <div className={styles.cockpit}></div>
          <div className={styles.wingRight}></div>
          <div className={styles.tail}></div>
          <div className={styles.fuselage}></div>
          <div className={styles.wingLeft}></div>
          <div className={styles.jetFlame}></div>
        </div>
      </div>

      {/* CENTERED GLASS CARD */}
      <div className={styles.mainCard}>
        
        {/* AVATAR */}
        <div className={styles.avatarCircle}>
          {formData.name.charAt(0).toUpperCase()}
        </div>

        {/* INPUTS */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.roundedInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.roundedInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={styles.roundedInput}
          />
        </div>

        {/* AGE DISPLAY (UPDATED TEXT) */}
        <div className={styles.ageDisplay}>
          You are {calculateAge(formData.dob)} years old
        </div>

        {/* STATS MINI-ROW */}
        <div className={styles.statsRow}>
          <div className={styles.miniStat}>
            <span className={styles.statVal}>{stats.currency}</span>
            <span className={styles.statLbl}>Coins</span>
          </div>
          <div className={styles.miniStat}>
            <span className={styles.statVal}>{stats.bestStreak}🔥</span>
            <span className={styles.statLbl}>Streak</span>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button className={styles.saveBtn} onClick={handleSave}>
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default MyProfile;