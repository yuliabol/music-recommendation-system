import React, { useEffect, useState } from "react";
import "./History.css";

function History({ onRecommendationsUpdate, currentTrack, onSongSelect }) {  // Додаємо onSongSelect
    const [history, setHistory] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const clearHistory = () => {
        fetch("http://127.0.0.1:8000/api/clear_history/", {
            method: "POST",
        })
            .then((response) => {
                if (response.ok) {
                    console.log("History cleared successfully");
                    setHistory([]);
                    onRecommendationsUpdate();
                }
            })
            .catch((error) => console.error("Error clearing history:", error));
    };

    const fetchHistory = () => {
        fetch("http://127.0.0.1:8000/api/history/")
            .then((response) => response.json())
            .then((data) => {
                const uniqueHistory = Array.from(
                    new Map(data.map((item) => [item.track_id, item])).values()
                );
                setHistory(uniqueHistory);
            })
            .catch((error) => console.error("Error fetching history:", error));
    };

    const saveSongHistory = (track_id) => {
        return fetch("http://127.0.0.1:8000/api/save_history/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ track_id: track_id }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("History saved", data);
                onRecommendationsUpdate();
            })
            .catch((error) => console.error("Error saving history:", error));
    };

    const updateHistory = () => {
        fetch("http://127.0.0.1:8000/api/history/")
            .then((response) => response.json())
            .then((data) => {
                const uniqueHistory = Array.from(
                    new Map(data.map((item) => [item.track_id, item])).values()
                );
                setHistory(uniqueHistory);
            })
            .catch((error) => console.error("Error fetching history:", error));
    };

    const fetchSongDetails = (track_id) => {
        fetch(`http://127.0.0.1:8000/api/songs/${track_id}/`)
            .then((response) => response.json())
            .then((data) => {
                // Передаємо деталі пісні в батьківський компонент
                onSongSelect(data);
            })
            .catch((error) => console.error("Error fetching song details:", error));
    };

    useEffect(() => {
        if (isFirstLoad) {
            clearHistory();
            setIsFirstLoad(false);
        } else {
            fetchHistory();
        }
    }, [isFirstLoad]);

    useEffect(() => {
        if (currentTrack && currentTrack.track_id) {
            saveSongHistory(currentTrack.track_id).then(() => {
                updateHistory();
            });
        }
    }, [currentTrack]);

    const handleSongSelect = (song) => {
        fetchSongDetails(song.track_id);  // Викликаємо fetchSongDetails, коли пісня вибрана
    };

    return (
        <div className="history">
            <h3>Your Listening History</h3>
            <div className="history_list_wrapper">
                <ul className="history_list">
                    {history.map((song, index) => (
                        <li key={index} onClick={() => handleSongSelect(song)}>
                            {song.artists} - {song.track_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default History;
