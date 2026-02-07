import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyProfile.module.css";

const MyProfile = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "Rather not say",
    difficulty: "Rookie"
  });

  const [age, setAge] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- Calculate Age ---
  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // --- Fetch Data ---
  useEffect(() => {
    const savedData = localStorage.getItem("userProfile");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({
          name: parsed.name || "",
          dob: parsed.dob || "",
          gender: parsed.gender || "Rather not say",
          difficulty: parsed.difficulty || "Rookie"
        });
        if (parsed.dob) setAge(calculateAge(parsed.dob));
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "dob") setAge(calculateAge(value));
  };

  // --- ALWAYS SAVE CHANGES ---
  const handleSave = () => {
    // 1. Save to Local Storage
    localStorage.setItem("userProfile", JSON.stringify(formData));
    // 2. Navigate back
    navigate("/dashboard", { state: { userName: formData.name } });
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      
      {/* Back Button */}
      <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <div className={styles.profileCard}>
        <div className={styles.leftColumn}>
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="Mascot" className={styles.mascot} />
          <h1 className={styles.title}>My Profile</h1>
        </div>

        <div className={styles.rightColumn}>
          {/* Name */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Explorer Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="Enter your name" 
            />
          </div>

          {/* DOB */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              value={formData.dob} 
              onChange={handleChange} 
              className={styles.input} 
            />
            {age !== null && !isNaN(age) && <span className={styles.ageText}>Age: {age}</span>}
          </div>

          {/* Gender (Exact Match) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={styles.input}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Rather not say">Rather not say</option>
            </select>
          </div>

          {/* Difficulty (Exact Match) */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Difficulty Level</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={styles.input}>
              <option value="Rookie">Rookie</option>
              <option value="I can watch English Movies (Intermediate)">I can watch English Movies (Intermediate)</option>
              <option value="All The World's a Stage (Skilled)">All The World's a Stage (Skilled)</option>
            </select>
          </div>

          <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;