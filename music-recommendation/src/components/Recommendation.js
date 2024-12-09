import React from "react";
import "./Recommendation.css";

const Recommendations = ({ recommendations, onSongSelect }) => {
    return (
      <div className="recommendations-container">
      <div className="scrollable">
        {recommendations.map((song, index) => (
          <div
            className="recommendation"
            key={index}
            onClick={() => onSongSelect(song)}
          >
            <div>
              <p className="song-title">{song.track_name}</p>
              <p className="song-artist">{song.artists}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
