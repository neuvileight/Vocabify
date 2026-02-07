import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import styles from "./Dashboard.module.css";

// --- OPTIMIZED MATRIX EFFECT ---
const GlitchBackground = ({ isDarkMode }) => {
  const canvasRef = useRef(null);
  const modeRef = useRef(isDarkMode);

  useEffect(() => {
    modeRef.current = isDarkMode;
  }, [isDarkMode]);

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
        const currentMode = modeRef.current;

        ctx.fillStyle = currentMode ? "rgba(15, 15, 15, 0.25)" : "rgba(248, 249, 250, 0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `bold ${fontSize}px monospace`; 

        for (let i = 0; i < drops.length; i++) {
          const text = charArray[Math.floor(Math.random() * charArray.length)];
          const alpha = Math.random(); 
          if(alpha > 0.98) {
            ctx.fillStyle = "#E056FD"; 
          } else {
            ctx.fillStyle = currentMode ? "#9B59B6" : "#8A2BE2"; 
          }

          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => { 
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.glitchCanvas} />;
};

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currency, setCurrency] = useState(0);

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
    if (savedCurrency) {
      setCurrency(parseInt(savedCurrency));
    }
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // --- UPDATED CLICK HANDLER ---
  const handleGameClick = (gameTitle) => {
    if (gameTitle === "Error Hunt") {
      navigate("/error-hunt");
    } else {
      alert("Coming Soon");
    }
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
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
      
      <GlitchBackground isDarkMode={isDarkMode} />

      <button className={styles.hamburgerBtn} onClick={toggleMenu}>
        ☰
      </button>

      {/* --- CURRENCY BUBBLE WITH TOOLTIP --- */}
      <div className={styles.currencyBadge}>
        <span className={styles.currencyTooltip}>
          (use currency to buy items)
        </span>
        <span style={{ fontSize: "1.2rem", filter: "drop-shadow(0 0 5px gold)" }}>💰</span>
        <span>{currency.toLocaleString()}</span>
      </div>

      <button className={styles.themeToggle} onClick={toggleTheme}>
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {isMenuOpen && (
        <div className={styles.menuDropdown}>
          <div className={styles.menuItem} onClick={() => navigate("/profile")}>
            👤 My Profile
          </div>
          <div className={styles.menuItem} onClick={() => alert("Review Clicked")}>
            ⭐ Add Review
          </div>
        </div>
      )}

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