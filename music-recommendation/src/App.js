import React, { useState, useEffect } from "react";
import TopArtists from "./components/TopArtists";
import SearchBar from "./components/SearchBar";
import Recommendations from "./components/Recommendation";
import Player from "./components/Player";
import History from "./components/History";
import ListeningHistory from "./components/ListeningHistory";
import "./App.css";

function App() {
  const [songData, setSongData] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [initialRecommendations, setInitialRecommendations] = useState([
    {
      track_id: 38,
      artists: "Eminem",
      track_name: "Without Me",
      audioUrl: "http://127.0.0.1:8000/api/play_song/38",
      imageUrl: "/album_covers/38.jpg",
    },
    {
      track_id: 30,
      artists: "Tom Odell",
      track_name: "Another Love",
      audioUrl: "http://127.0.0.1:8000/api/play_song/30",
      imageUrl: "/album_covers/30.jpg",
    },
    {
      track_id: 22,
      artists: "Måneskin",
      track_name: 'Beggin',
      audioUrl: "http://127.0.0.1:8000/api/play_song/22",
      imageUrl: "/album_covers/22.jpg",
    },
    {
      track_id: 11,
      artists: "The Weeknd",
      track_name: "Blinding Lights",
      audioUrl: "http://127.0.0.1:8000/api/play_song/11",
      imageUrl: "/album_covers/11.jpg",
    },
    {
      track_id: 41,
      artists: "Adele",
      track_name: "Rolling in the Deep",
      audioUrl: "http://127.0.0.1:8000/api/play_song/41",
      imageUrl: "/album_covers/41.jpg",
    },
  ]);

  useEffect(() => {
    // Завантаження початкових даних про пісні
    fetch("http://127.0.0.1:8000/api/songs/")
      .then((response) => response.json())
      .then((data) => {
        setSongData(data);
      })
      .catch((error) => {
        console.error("Error fetching song data:", error);
      });
  }, []);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const fetchRecommendations = () => {
  fetch("http://127.0.0.1:8000/api/recommendations/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      song_list: [ /* your song list data here */ ],
      n_songs: 10, // or any number of songs to recommend
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      setRecommendations(data);
    })
    .catch((error) => {
      console.error("Error fetching recommendations:", error);
    });
};


  useEffect(() => {
    // Завантаження рекомендацій при першому завантаженні
    fetchRecommendations();
  }, []);

  const [listeningHistory, setListeningHistory] = useState([]);

  useEffect(() => {
  console.log("useEffect for listening history triggered"); 
  fetch("http://127.0.0.1:8000/api/history/") // API для отримання історії прослуховувань
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setListeningHistory(data); // Оновлення стану з новими даними
    })
    .catch((error) => {
      console.error("Error fetching listening history:", error);
    });
}, [selectedSong]); // Додано залежність від selectedSong



  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Find your next favorite song with smart recommendations</h1>
          <h2>Our system learns your music taste to bring you personalized song suggestions</h2>
          <p>Start your musical journey now!</p>
        </div>
      </header>
      <div className="content">
        <div className="sidebar">
          <TopArtists />
        </div>
        <SearchBar data={songData} onSelect={handleSongSelect} />
        <h3 className="rec">Recommendations</h3>
        <Recommendations
          recommendations={recommendations.length ? recommendations : initialRecommendations}
          onSongSelect={setSelectedSong}
        />
        {selectedSong && <Player selectedSong={selectedSong} />}
        <History onSongSelect={handleSongSelect} onRecommendationsUpdate={fetchRecommendations} currentTrack={selectedSong} />
        <ListeningHistory history={listeningHistory} />

      </div>
    </div>
  );
}

export default App;
