import React, { useState, useEffect } from "react";
import "./Player.css"; // CSS-стилі
import playIcon from "./play.webp";
import pauseIcon from "./pause.webp";

const Player = ({ selectedSong }) => {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // volume 1 = 100%

  useEffect(() => {
    if (selectedSong) {
      // --- API Call to Save History ---
      fetch("http://127.0.0.1:8000/api/save_history/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          track_id: track_id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(selectedSong)
          console.log(selectedSong.track_id)
          console.log(selectedSong.track_name)
          console.log("History updated:", data);
        })
        .catch((error) => {
          console.error("Error updating history:", error);
        });

      // --- Initialize New Audio ---
      const { audioUrl } = selectedSong;
      const newAudio = new Audio(audioUrl);
      setAudio(newAudio);

      // Update current time and duration
      newAudio.ontimeupdate = () => setCurrentTime(newAudio.currentTime);
      newAudio.onloadedmetadata = () => setDuration(newAudio.duration);

      // Cleanup previous audio
      return () => {
        if (audio) {
          audio.pause();
        }
        newAudio.pause();
      };
    }
  }, [selectedSong]);
  

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
    }
  };

  if (!selectedSong) return null;
  const { track_id, track_name, artists, audioUrl, imageUrl } = selectedSong;

  return (
    <div className="player">
      <img src={imageUrl} alt={`${track_name} cover`} className="player-cover" />
      <div className="player-details">
        <h3 className="track-name">{track_name}</h3>
        <p className="artist-name">{artists}</p>
      </div>
      <div className="player-seekbar">
        <input
          type="range"
          min="0"
          max={duration || 1} // Add fallback to 1 to avoid problem
          value={currentTime}
          onChange={handleTimeChange}
          className="seekbar"
        />
      </div>
      <div className="player-controls">
        <button className="control-button" onClick={togglePlay}>
          <img
            src={isPlaying ? pauseIcon : playIcon}
            alt={isPlaying ? "Pause" : "Play"}
            className="icon"
          />
        </button>
      </div>
      <div className="player-volume">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-control"
        />
      </div>
    </div>
  );
};

export default Player;
