import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NextPage.module.css";

const NextPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [skill, setSkill] = useState("");

  const [errors, setErrors] = useState({});
  const [genderOpen, setGenderOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- UPDATED OPTIONS (Matching MyProfile) ---
  const genderOptions = [
    { label: "Male", icon: "♂️", value: "Male" },
    { label: "Female", icon: "♀️", value: "Female" },
    { label: "Rather not say", icon: "⊘", value: "Rather not say" }, 
  ];

  const skillOptions = [
    { label: "Rookie", value: "Rookie" },
    { label: "I can watch English Movies (Intermediate)", value: "I can watch English Movies (Intermediate)" },
    { label: "All The World's a Stage (Skilled)", value: "All The World's a Stage (Skilled)" },
  ];

  const handleContinue = () => {
    let newErrors = {};
    let isValid = true;

    if (!name.trim()) { newErrors.name = "Please enter your name"; isValid = false; }
    if (!skill) { newErrors.skill = "Please select a skill level"; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
      // --- SAVE DATA EXACTLY AS SELECTED ---
      const userProfile = {
        name: name,
        dob: dob,
        gender: gender, 
        difficulty: skill 
      };
      
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      navigate('/dashboard', { state: { userName: name } }); 
    }
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      <button className={styles.themeToggle} onClick={toggleTheme}>{isDarkMode ? "☀️" : "🌙"}</button>

      <div className={styles.card}>
        <div className={styles.leftPanel}>
          <div className={styles.mascotContainer}>
            <div className={styles.mascot}>
              <div className={styles.mascotFace}>
                <div className={`${styles.eye} ${styles.eyeLeft}`}></div>
                <div className={`${styles.eye} ${styles.eyeRight}`}></div>
                <div className={styles.mouth}></div>
              </div>
            </div>
            <div className={styles.mascotShadow}></div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>Tell us about you!</h1>
            <p className={styles.subtitle}>Let's personalize your learning path.</p>

            <form className={styles.form}>
              {/* NAME */}
              <div className={styles.formGroup}>
                <label className={styles.label}>What should we call you?</label>
                <input 
                  type="text" 
                  className={`${styles.inputField} ${errors.name ? styles.inputError : ""}`}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({...errors, name: null}); }}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              {/* DOB & GENDER */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date of Birth</label>
                  <input type="date" className={styles.inputField} value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Gender</label>
                  <div className={`${styles.customSelect} ${genderOpen ? styles.active : ""}`} onClick={() => { setGenderOpen(!genderOpen); setSkillOpen(false); }}>
                    <span className={styles.selectedValue}>{gender || "Choose"}</span>
                    <span className={styles.arrow}>▼</span>
                    <div className={`${styles.optionsMenu} ${genderOpen ? styles.show : ""}`}>
                      {genderOptions.map((opt) => (
                        <div key={opt.value} className={styles.optionItem} onClick={(e) => { e.stopPropagation(); setGender(opt.value); setGenderOpen(false); }}>
                          <span className={styles.icon}>{opt.icon}</span>{opt.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SKILL */}
              <div className={styles.formGroup}>
                <label className={styles.label}>How skilled in English are You?</label>
                <div className={`${styles.customSelect} ${skillOpen ? styles.active : ""} ${errors.skill ? styles.inputError : ""}`} onClick={() => { setSkillOpen(!skillOpen); setGenderOpen(false); }}>
                  <span className={styles.selectedValue}>{skill || "Choose"}</span>
                  <span className={styles.arrow}>▼</span>
                  <div className={`${styles.optionsMenu} ${skillOpen ? styles.show : ""}`}>
                    {skillOptions.map((opt) => (
                      <div key={opt.value} className={styles.optionItem} onClick={(e) => { e.stopPropagation(); setSkill(opt.value); setSkillOpen(false); if (errors.skill) setErrors({...errors, skill: null}); }}>
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>
                {errors.skill && <span className={styles.errorText}>{errors.skill}</span>}
              </div>

              <button type="button" className={styles.submitButton} onClick={handleContinue}>Continue</button>
              <div style={{ height: "40px" }}></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextPage;