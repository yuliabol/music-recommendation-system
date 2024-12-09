import React, { useState, useEffect } from "react";
import "./ListeningHistory.css";

const ListeningHistory = ({ history }) => {
  const [detailedHistory, setDetailedHistory] = useState([]);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const handleToggle = () => {
    setShowFullHistory(!showFullHistory);
  };

  useEffect(() => {
    // Перевіряємо, чи є дані в history, щоб уникнути зайвих запитів
    if (history.length) {
      // Завантаження деталей треків, якщо history вже містить дані
      const fetchDetails = async () => {
        const details = await Promise.all(
          history.map(async (track) => {
            const response = await fetch(`http://127.0.0.1:8000/api/songs/${track.track_id}`);
            const data = await response.json();
            return data;
          })
        );
        setDetailedHistory(details);
      };
      
      fetchDetails();
    }
  }, [history]);  // Викликаємо useEffect лише коли history змінюється

  return (
    <div className="recently">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
        {detailedHistory.slice(0, 4).map((track, index) => (
          <div key={index} onClick={handleToggle} style={{ cursor: "pointer" }}>
            <img src={track.imageUrl} alt={track.track_name} style={{ width: "100%", borderRadius: "1px" }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeningHistory;
