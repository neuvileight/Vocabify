import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import styles from "./Dashboard.module.css";
import { useTheme } from "../context/ThemeContext"; 

// --- MATRIX COMPONENT ---
const GlitchBackground = ({ isDarkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    let animationFrameId;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&<>[]{}";
    const charArray = chars.split("");
    const fontSize = 20; 
    const columns = canvas.width / fontSize;
    const drops = []; 

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -50; 
    }

    let lastTime = 0;
    const targetFPS = 24; 
    const frameInterval = 1000 / targetFPS;

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);
      const deltaTime = currentTime - lastTime;

      if (deltaTime > frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);
        ctx.fillStyle = isDarkMode ? "rgba(5, 5, 5, 0.25)" : "rgba(240, 240, 240, 0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `bold ${fontSize}px monospace`; 

        for (let i = 0; i < drops.length; i++) {
          const text = charArray[Math.floor(Math.random() * charArray.length)];
          const alpha = Math.random(); 
          if(alpha > 0.98) {
            ctx.fillStyle = "#fff"; 
          } else {
            ctx.fillStyle = isDarkMode ? "#E056FD" : "#1F2937"; 
          }
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) drops[i] = 0;
          drops[i]++;
        }
      }
    };
    animationFrameId = requestAnimationFrame(draw);
    return () => { 
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setSize);
    };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className={styles.glitchCanvas} />;
};

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currency, setCurrency] = useState(0);
  const [streak, setStreak] = useState(0);

  const location = useLocation();
  const navigate = useNavigate(); 
  
  const [userName, setUserName] = useState(() => {
    if (location.state?.userName) return location.state.userName;
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      return parsed.name || "Explorer";
    }
    return "Explorer";
  });

  useEffect(() => {
    const savedCurrency = localStorage.getItem("userCurrency");
    if (savedCurrency) setCurrency(parseInt(savedCurrency));
    const savedStreak = localStorage.getItem("userStreak");
    setStreak(savedStreak ? parseInt(savedStreak) : 5);
  }, []);

  const handleGameClick = (gameTitle) => {
    if (gameTitle === "Error Hunt") navigate("/error-hunt");
    else alert("Coming Soon");
  };

  // --- UPDATED: Navigate to Store Page ---
  const handleStoreClick = () => {
    navigate("/store");
  };

  const gridItems = [
    { id: 1, icon: "?", title: "Error Hunt" },
    { id: 2, icon: "∷", title: "Grammar Puzzle" },
    { id: 3, icon: "Aa", title: "Vocabulary" },
    { id: 4, icon: "↹", title: "Sentence Flow" },
    { id: 5, icon: "≡", title: "Story Mode" },
    { id: 6, icon: "∞", title: "Synonym Usage" },
    { id: 7, icon: "⚡", title: "Rapid Fire" }
  ];

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      
      <GlitchBackground isDarkMode={isDarkMode} />

      <button className={styles.hamburgerBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      {isMenuOpen && (
        <div className={styles.menuDropdown}>
          <div className={styles.menuItem} onClick={() => navigate("/profile")}>
            👤 My Profile
          </div>
          <div className={styles.menuItem} onClick={() => alert("Review Clicked")}>
            ⭐ Add Review
          </div>
          <div className={styles.menuItem} onClick={() => { toggleTheme(); setIsMenuOpen(false); }}>
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </div>
        </div>
      )}

      {/* --- TOP RIGHT GROUP (Stats + Store) --- */}
      <div className={styles.topRightGroup}>
        
        {/* ROW 1: Badges */}
        <div className={styles.statsRow}>
          <div className={`${styles.badge} ${styles.currency}`}>
            <span style={{ fontSize: "1.2rem", filter: "drop-shadow(0 0 5px gold)" }}>💰</span>
            <span>{currency.toLocaleString()}</span>
            <span className={styles.tooltip}>Current Balance</span>
          </div>

          <div className={`${styles.badge} ${styles.streak}`}>
            <span style={{ fontSize: "1.2rem", filter: "drop-shadow(0 0 5px orange)" }}>🔥</span>
            <span>{streak}</span>
            <span className={styles.tooltip}>Daily Streak</span>
          </div>
        </div>

        {/* ROW 2: Store Button (Icon Only - Squircle) */}
        <button className={styles.storeBtn} onClick={handleStoreClick} title="Marketplace">
          <span className={styles.cartIcon}>🛒</span>
        </button>
      </div>

      <header className={styles.header}>
        <div className={styles.greetingGroup}>
          <h1 className={styles.welcomeText}>
            Welcome, <span className={styles.userName}>{userName}</span>
          </h1>
          <p className={styles.subText}>Choose your challenge.</p>
        </div>
      </header>

      <div className={styles.questBar}>
        {gridItems.map((item) => (
          <div 
            key={item.id} 
            className={`${styles.squircle} ${styles.matteBlue}`}
            onClick={() => handleGameClick(item.title)}
          >
            <span className={styles.abstractIcon}>{item.icon}</span>
            <div className={styles.hoverLabel}>
              {item.title}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Dashboard;