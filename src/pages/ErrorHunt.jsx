import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorHunt.module.css";

const ErrorHunt = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [topic, setTopic] = useState("");
  const [passageWords, setPassageWords] = useState([]);
  const [score, setScore] = useState(0);
  
  const [maxLives, setMaxLives] = useState(3);
  const [lives, setLives] = useState(3);
  
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [message, setMessage] = useState("Enter a topic to start");
  
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [totalErrorsInPassage, setTotalErrorsInPassage] = useState(0);
  const [foundErrorsCount, setFoundErrorsCount] = useState(0);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);

  // --- STATS TRACKING ---
  const [restarts, setRestarts] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [finalReward, setFinalReward] = useState(0);

  // --- LIBRARY (5 Levels) ---
  const passageLibrary = {
    space: [
      "The astronaut floats silently through the dark station. His helmet visor reflects the blue light of Earth below. Suddenly, a warning alarm beeps loudly in his headset.",
      "The star shines brighter when you are outside the atmosphere. Gravity does not exist here, so everything drifts freely. The rocket engine needs fuel to return home.",
      "The alien ship hovered over the crater. Its lights pulsed with a strange green energy. We watched in silence as the doors slowly opened.",
      "Mars is known as the Red Planet because of its rusty soil. The rover drives across the surface looking for signs of water. The dust storm can last for weeks.",
      "A black hole pulls everything into its center. Not even light can escape its massive gravity. It remains one of the greatest mysteries of the universe."
    ],
    pirate: [
      "The captain steers the ship through the violent storm. His treasure map is soaking wet from the rain. A parrot flies angrily over the deck.",
      "The gold coin glittered inside the wooden chest. The crew cheered as they lifted it onto the sand. They had finally found the lost island.",
      "The cannonball flew across the water, missing our hull by inches. The enemy flag waved in the wind. We prepared to board their vessel.",
      "The anchor dropped into the deep blue sea. The ship stopped moving near the coral reef. The diver jumped in to look for the sunken wreck.",
      "A mysterious fog rolled over the ocean at midnight. The sailor whispered stories of ghost ships and curses. The captain told him to remain quiet."
    ],
    tech: [
      "The computer runs very slowly today because of the update. I wrote an algorithm that solves the complex problem. The mechanical keyboard is missing a key.",
      "Coding requires patience and logic to master. If you miss a semicolon, the program crashes immediately. Debugging is the art of finding hidden errors.",
      "The server room hums with the sound of cooling fans. Data travels through fiber optic cables at the speed of light. Security protocols are active.",
      "Artificial intelligence learns how to paint pictures. It analyzes thousands of images to understand style. Some fear it will replace human artists soon.",
      "The virtual reality headset transports players to new worlds. You can climb mountains or fly planes from your living room. The graphics look incredibly realistic."
    ],
    nature: [
      "The ancient tree stands tall in the middle of the forest. Its roots go deep into the earth, drinking water. The bird builds a nest in the high branches.",
      "A tiger moves quietly through the tall grass. It watches the herd of deer grazing nearby. The jungle is silent, waiting for the strike.",
      "Rain falls gently on the roof of the cabin. The fire crackles warmly in the fireplace. Outside, the wind howls through the valley.",
      "The desert is hot during the day but freezing at night. The cactus plant stores water in its thick stems. The scorpion hides under the rocks.",
      "The dolphin jumps out of the ocean waves playfully. It communicates with others using clicks and whistles. It is a highly intelligent marine mammal."
    ],
    default: [
      "The explorer walks through the dense jungle slowly. He looks for an ancient artifact hidden in the ruins. The wind blows hard against his face.",
      "Science explains how the universe works. Chemistry studies how matter changes and reacts. Physics describes the motion of objects through space.",
      "History teaches us about the mistakes of the past. A great civilization rises and falls over centuries. We learn from books written before us.",
      "Music has the power to change our mood instantly. A sad song can make us cry, while upbeat tunes make us dance. Rhythm is universal.",
      "Reading books expands your vocabulary and imagination. You can travel to different worlds without leaving your chair. Libraries are treasures of knowledge."
    ]
  };

  // --- CHAOS ENGINE ---
  const generateErrors = (text) => {
    let attempts = 0;
    while (attempts < 10) {
      const words = text.split(" ");
      const candidates = [];
      words.forEach((word, index) => {
        const cleanWord = word.replace(/[.,!?;:]/g, "");
        const lower = cleanWord.toLowerCase();
        let type = null;
        if (cleanWord.endsWith("s") && cleanWord.length > 3 && !cleanWord.endsWith("ss")) type = "plural";
        else if (cleanWord.endsWith("ed") && cleanWord.length > 4) type = "past";
        else if (["their", "there", "they're", "your", "you're", "its", "it's", "to", "too", "an", "a", "writes", "wrote", "flies", "flew"].includes(lower)) type = "swap";
        if (type) candidates.push({ index, word, cleanWord, type });
      });

      let targets = [];
      const minErrors = 2; 
      const shuffled = candidates.sort(() => 0.5 - Math.random());
      const maxAllowed = Math.ceil(words.length * 0.4);
      const countToPick = Math.max(minErrors, Math.min(shuffled.length, maxAllowed));
      targets = shuffled.slice(0, countToPick);
      const targetIndices = new Set(targets.map(t => t.index));

      const processedWords = [];
      let calculatedErrorCount = 0;

      words.forEach((word, index) => {
        let finalWord = word;
        let isError = false;
        
        if (targetIndices.has(index)) {
          const cleanWord = word.replace(/[.,!?;:]/g, "");
          const punctuation = word.slice(cleanWord.length);
          const lower = cleanWord.toLowerCase();
          
          if (cleanWord.endsWith("s") && cleanWord.length > 3 && !cleanWord.endsWith("ss")) {
             finalWord = cleanWord.slice(0, -1) + punctuation; 
          } else if (cleanWord.endsWith("ed") && cleanWord.length > 4) {
             finalWord = cleanWord.slice(0, -2) + punctuation; 
          } else {
             const swapMap = {
              "their": "there", "there": "their", "they're": "there",
              "your": "you're", "you're": "your", "its": "it's", "it's": "its",
              "to": "too", "too": "to", "an": "a", "a": "an",
              "writes": "write", "wrote": "writed", "flies": "fly", "flew": "flyed"
             };
             if (swapMap[lower]) {
               const newBase = swapMap[lower];
               finalWord = (cleanWord[0] === cleanWord[0].toUpperCase() 
                 ? newBase.charAt(0).toUpperCase() + newBase.slice(1) 
                 : newBase) + punctuation;
             }
          }
        }
        
        if (finalWord !== word) {
          isError = true;
          calculatedErrorCount++;
        }
        processedWords.push({ id: index, text: finalWord, original: word, isError: isError, status: "neutral" });
      });

      if (calculatedErrorCount > 0) return { processedWords, errorCount: calculatedErrorCount };
      attempts++;
    }
    return { processedWords: [], errorCount: 0 };
  };

  const getTemplate = (topicInput, index) => {
    const t = topicInput.toLowerCase();
    let templates = passageLibrary.default;
    if (t.includes("space") || t.includes("star")) templates = passageLibrary.space;
    else if (t.includes("pirate") || t.includes("sea")) templates = passageLibrary.pirate;
    else if (t.includes("code") || t.includes("tech")) templates = passageLibrary.tech;
    else if (t.includes("nature")) templates = passageLibrary.nature;
    return templates[index % 5];
  };

  // --- LOGIC: Finish Game ---
  const finishGame = () => {
    let reward = 200 - (restarts * 20);
    if (reward < 0) reward = 0;
    
    setFinalReward(reward);
    setGameCompleted(true);
    
    const currentBank = parseInt(localStorage.getItem("userCurrency") || "0");
    localStorage.setItem("userCurrency", currentBank + reward);
  };

  // --- LOGIC: Play Again ---
  const handlePlayAgain = () => {
    setScore(0);
    setMaxLives(3);
    setLives(3);
    setRestarts(0);
    setTotalMistakes(0);
    setCurrentStreak(0);
    setLongestStreak(0);
    setGameCompleted(false);
    setGameActive(false); // Go back to start screen
    setTopic(""); // Reset topic
    setMessage("Enter a topic to start");
    setPassageWords([]);
  };

  // --- HANDLERS ---
  const handleGenerate = (e, overrideIndex = null, overrideLives = null) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    const idx = overrideIndex !== null ? overrideIndex : currentPassageIndex;
    const rawText = getTemplate(topic, idx);
    const { processedWords, errorCount } = generateErrors(rawText);
    
    setPassageWords(processedWords);
    setTotalErrorsInPassage(errorCount);
    setFoundErrorsCount(0);
    setGameActive(true);
    
    if(overrideIndex === null) {
      setScore(0);
      setMaxLives(3); 
      setLives(3);    
      setRestarts(0);
      setTotalMistakes(0);
      setCurrentStreak(0);
      setLongestStreak(0);
      setGameCompleted(false);
    } else if (overrideLives !== null) {
      setLives(overrideLives);
    }
    
    setMessage(`Topic: ${topic} • Level ${idx + 1}`);
  };

  const handleNextLevel = () => {
    const nextIndex = currentPassageIndex + 1;
    
    if (nextIndex >= 5) {
      finishGame(); 
      return;
    }

    setCurrentPassageIndex(nextIndex);
    setShowSuccessModal(false);
    handleGenerate(null, nextIndex);
  };

  const handlePreviousLevel = () => {
    if (currentPassageIndex > 0) {
      const prevIndex = currentPassageIndex - 1;
      setCurrentPassageIndex(prevIndex);
      setShowSuccessModal(false);
      handleGenerate(null, prevIndex);
    }
  };

  const handleWordClick = (id) => {
    if (lives <= 0 || showSuccessModal || showFailModal || gameCompleted) return;

    let newFoundCount = foundErrorsCount;
    let newLives = lives;

    const updatedWords = passageWords.map(w => {
      if (w.id === id) {
        if (w.isError) {
          if (w.status !== "found") {
            setScore(prev => prev + 100);
            newFoundCount++;
            
            const nextStreak = currentStreak + 1;
            setCurrentStreak(nextStreak);
            if (nextStreak > longestStreak) setLongestStreak(nextStreak);

            return { ...w, status: "found", text: w.original }; 
          }
        } else {
          newLives -= 1;
          setLives(newLives);
          setTotalMistakes(prev => prev + 1);
          setCurrentStreak(0);
          return { ...w, status: "wrong" };
        }
      }
      if (w.status === "wrong") return { ...w, status: "neutral" };
      return w;
    });

    setPassageWords(updatedWords);
    setFoundErrorsCount(newFoundCount);
    
    if (newFoundCount === totalErrorsInPassage && totalErrorsInPassage > 0) {
      if (currentPassageIndex === 4) {
        setTimeout(() => {
          finishGame(); 
        }, 600);
      } else {
        setTimeout(() => setShowSuccessModal(true), 600);
      }
    }
    
    if (newLives <= 0) {
      setTimeout(() => setShowFailModal(true), 600);
    }
  };

  const handleRestartRun = () => {
    const nextMaxLives = maxLives - 1;
    setRestarts(prev => prev + 1); 
    
    if (nextMaxLives <= 0) {
      alert("Game Over! No lives left.");
      window.location.reload(); 
    } else {
      setMaxLives(nextMaxLives);
      setCurrentPassageIndex(0);
      setShowFailModal(false);
      
      const rawText = getTemplate(topic, 0);
      const { processedWords, errorCount } = generateErrors(rawText);
      setPassageWords(processedWords);
      setTotalErrorsInPassage(errorCount);
      setFoundErrorsCount(0);
      setLives(nextMaxLives);
      setCurrentStreak(0);
      setMessage(`Topic: ${topic} • Level 1 (Retrying)`);
    }
  };

  const isLevelClear = foundErrorsCount === totalErrorsInPassage && totalErrorsInPassage > 0;

  return (
    <div className={styles.container}>
      
      {/* SUCCESS MODAL (Levels 1-4) */}
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.successTitle}>🎉 Clean Run!</h2>
            <p className={styles.modalText}>
              Errors corrected.<br/>Ready for the next sector?
            </p>
            <button className={`${styles.successBtn} ${styles.modalBtn}`} onClick={handleNextLevel}>
              Next Level
            </button>
          </div>
        </div>
      )}

      {/* FAIL MODAL */}
      {showFailModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.failTitle}>💥 Mission Failed</h2>
            <p className={styles.modalText}>
              Lives depleted.<br/>
              <strong>Penalty:</strong> Restart from Level 1 with <strong>{maxLives - 1}</strong> lives.
            </p>
            <button className={`${styles.failBtn} ${styles.modalBtn}`} onClick={handleRestartRun}>
              Restart Level 1
            </button>
          </div>
        </div>
      )}

      <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
        Exit
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>Error Hunt</h1>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>⭐</span> {score}
          </div>
          <div className={styles.statItem}>
             ❤️ {lives} / {maxLives}
          </div>
        </div>
      </header>

      {/* INPUT */}
      {!gameActive && !gameCompleted && (
        <form className={styles.inputSection} onSubmit={(e) => {
          setCurrentPassageIndex(0); handleGenerate(e, 0);
        }}>
          <input 
            type="text" className={styles.topicInput}
            placeholder="Topic (Space, Pirate, Tech...)"
            value={topic} onChange={(e) => setTopic(e.target.value)}
          />
          <button type="submit" className={styles.generateBtn}>Play</button>
        </form>
      )}

      {/* --- PROGRESS PAGE --- */}
      {gameCompleted ? (
        <div className={styles.gameBoard}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>MISSION ACCOMPLISHED</h2>
            
            <div className={styles.summaryGrid}>
              <div className={styles.summaryStat}>
                <span className={styles.statLabel}>Total Mistakes</span>
                <span className={styles.statValue} style={{ color: "#DC2626" }}>{totalMistakes}</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.statLabel}>Best Streak</span>
                <span className={styles.statValue} style={{ color: "#059669" }}>{longestStreak} 🔥</span>
              </div>
              
              <div className={styles.coinReward}>
                <span className={styles.coinIcon}>💰</span>
                <span>+{finalReward} Currency</span>
                <div style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8 }}>
                  (Base 200 - {restarts * 20} Penalties)
                </div>
              </div>
            </div>

            <div className={styles.summaryBtnRow}>
              <button className={styles.continueBtn} onClick={handlePlayAgain}>
                Play Again
              </button>
              <button className={styles.homeBtn} onClick={() => navigate("/dashboard")}>
                Return Home
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* --- ACTIVE GAME --- */
        <div className={styles.gameBoard}>
          <p className={styles.message}>
            {message} {gameActive && `— ${foundErrorsCount}/${totalErrorsInPassage} Errors Found`}
          </p>

          <div className={styles.scrollContainer}>
            {gameActive && (
              <div className={styles.passageText}>
                {passageWords.map((word) => (
                  <React.Fragment key={word.id}>
                    <span
                      onClick={() => handleWordClick(word.id)}
                      className={`
                        ${styles.word} 
                        ${word.status === "found" ? styles.correct : ""} 
                        ${word.status === "wrong" ? styles.wrong : ""}
                      `}
                    >
                      {word.text}
                    </span>
                    {" "}
                  </React.Fragment>
                ))}
              </div>
            )}
            
            {lives <= 0 && !showFailModal && (
              <div style={{ marginTop: "30px", color: "#DC2626", fontWeight: "bold", textAlign: "center" }}>
                <h2>Run Ended.</h2>
              </div>
            )}
          </div>

          {gameActive && lives > 0 && !showSuccessModal && (
            <div className={styles.navRow}>
              <button className={styles.navBtn} onClick={handlePreviousLevel} disabled={currentPassageIndex === 0}>
                Prev
              </button>
              
              <button 
                className={styles.navBtn} 
                onClick={handleNextLevel}
                disabled={!isLevelClear}
                title={!isLevelClear ? "Clear current level to unlock" : "Proceed"}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorHunt;