import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Store.module.css";

const Store = () => {
  const navigate = useNavigate();
  
  const [currency, setCurrency] = useState(0);
  const [maxLives, setMaxLives] = useState(3);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState(null);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("userCurrency");
    if (savedCurrency) setCurrency(parseInt(savedCurrency));

    const savedLives = localStorage.getItem("userMaxLives");
    if (savedLives) setMaxLives(parseInt(savedLives));
    else localStorage.setItem("userMaxLives", 3);
  }, []);

  const buyLives = (item) => {
    if (currency >= item.cost) {
      const newBalance = currency - item.cost;
      setCurrency(newBalance);
      localStorage.setItem("userCurrency", newBalance);

      const newMaxLives = maxLives + item.lives;
      setMaxLives(newMaxLives);
      localStorage.setItem("userMaxLives", newMaxLives);

      setPurchasedItem(item);
      setShowModal(true);
    } else {
      alert("Insufficient Funds!");
    }
  };

  const storeItems = [
    { id: 1, title: "Small Pouch", lives: 1, cost: 200, type: "single" },
    { id: 2, title: "Heart Box", lives: 3, cost: 12000, type: "triple" },
    { id: 3, title: "Life Chest", lives: 10, cost: 40000, type: "chest" },
  ];

  const renderIcon = (type) => {
    if (type === "single") {
      return (
        <div className={styles.glowContainer}>
          <span className={styles.singleHeart}>❤️</span>
        </div>
      );
    } 
    if (type === "triple") {
      return (
        <div className={styles.heartPile}>
          <span className={`${styles.hp} ${styles.hp1}`}>❤️</span>
          <span className={`${styles.hp} ${styles.hp2}`}>❤️</span>
          <span className={`${styles.hp} ${styles.hp3}`}>❤️</span>
        </div>
      );
    } 
    if (type === "chest") {
      return (
        <div className={styles.chestContainer}>
          <span className={`${styles.floatHeart} ${styles.fh1}`}>❤️</span>
          <span className={`${styles.floatHeart} ${styles.fh2}`}>❤️</span>
          <span className={styles.chest}>🧰</span>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      
      {/* SUCCESS MODAL */}
      {showModal && purchasedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.successTitle}>ACQUIRED!</h2>
            <p className={styles.successText}>
              + {purchasedItem.lives} MAX LIVES
            </p>
            <button className={styles.modalBtn} onClick={() => setShowModal(false)}>
              CONFIRM
            </button>
          </div>
        </div>
      )}

      <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
        EXIT
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>RESOURCES</h1>
        <div className={styles.subtitle}>Increase your maximum lives!</div>
      </div>

      <div className={styles.grid}>
        {storeItems.map((item) => (
          <div key={item.id} className={styles.card}>
            
            <div className={styles.cardHeader}>
              <h3 className={styles.itemName}>{item.title}</h3>
              <div className={styles.itemAmount}>+{item.lives} Lives</div>
            </div>

            {renderIcon(item.type)}

            <button 
              className={styles.buyBtn} 
              onClick={() => buyLives(item)}
              disabled={currency < item.cost}
            >
              <span>💰</span>
              {item.cost.toLocaleString()}
            </button>

          </div>
        ))}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.resourceBox}>
          <span style={{ fontSize: "1.5rem" }}>💰</span>
          <span className={styles.resValue}>{currency.toLocaleString()}</span>
        </div>

        <div className={styles.resourceBox} style={{ borderColor: "#ef4444" }}>
          <span style={{ fontSize: "1.5rem" }}>❤️</span>
          <span className={styles.resValue}>{maxLives}</span>
          <span className={styles.resLabel} style={{ marginLeft: "10px" }}>Max</span>
        </div>
      </div>

    </div>
  );
};

export default Store;