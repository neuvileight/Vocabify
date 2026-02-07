import React, { useState } from "react";
import styles from "./landing.module.css"; 

const Landing = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const openAboutModal = (e) => {
    e.preventDefault();
    setShowAbout(true);
    setMenuOpen(false); // Close menu when opening popup
  };

  const closeAboutModal = () => setShowAbout(false);

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      {/* --- HEADER --- */}
      <header className={styles.header}>
        <div className={styles.logo}>VOCABIFY</div>

        <div className={styles.headerRight}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`${styles.dropdownMenu} ${menuOpen ? styles.open : ""}`}>
          <a href="#about" onClick={openAboutModal} className={styles.menuItem}>
            About Us
          </a>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className={styles.mainContent}>
        <div className={styles.illustration}>
          <div className={styles.characterGroup}>
            {/* Floating Emojis */}
            <div className={`${styles.floatingChar} ${styles.char1}`}>📚</div>
            <div className={`${styles.floatingChar} ${styles.char2}`}>✨</div>
            <div className={`${styles.floatingChar} ${styles.char3}`}>🎯</div>
            <div className={`${styles.floatingChar} ${styles.char4}`}>💡</div>
            <div className={`${styles.floatingChar} ${styles.char5}`}>🚀</div>

            {/* Central Mascot */}
            <div className={styles.mascot}>
              <div className={styles.mascotFace}>
                <div className={`${styles.eye} ${styles.eyeLeft}`}></div>
                <div className={`${styles.eye} ${styles.eyeRight}`}></div>
                <div className={styles.mouth}></div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.headline}>
            The Most Fun and Effective way To Learn English!
          </h1>

          <a href="/next-page" className={styles.ctaButton}>
            Get Started
          </a>
        </div>
      </div>

      {/* --- POPUP MODAL (ABOUT US) --- */}
      {showAbout && (
        <div className={styles.modalOverlay} onClick={closeAboutModal}>
          <div 
            className={styles.modalContent} 
            onClick={(e) => e.stopPropagation()} 
          >
            <button className={styles.closeButton} onClick={closeAboutModal}>&times;</button>
            
            <h2 className={styles.modalTitle}>About Us</h2>
            <p className={styles.modalDesc}>
              This app was Developed for our Software Engineering Project.
            </p>
            
            <h3 className={styles.teamHeading}>Our Team:</h3>

            <div className={styles.teamList}>
              <div className={styles.teamMember}>
                <strong>Kanishk Kapoor</strong> <span className={styles.role}>(CEO)</span>
              </div>
              <div className={styles.teamMember}>
                <strong>Naman Sharma</strong> <span className={styles.role}>(Project Manager)</span>
              </div>
              <div className={styles.teamMember}>
                <strong>Nandini Tiwari</strong> <span className={styles.role}>(Developer)</span>
              </div>
              <div className={styles.teamMember}>
                <strong>Parangat Mudhbari</strong> <span className={styles.role}>(Tester)</span>
              </div>
              <div className={styles.teamMember}>
                <strong>Joydeep Nalawade</strong> <span className={styles.role}>(Intern)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;