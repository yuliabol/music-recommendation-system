import React from "react";
import "./TopArtists.css";

const artists = [
  { id: 1, img: "images/adele.png", name: "Adele" },
  { id: 2, img: "images/billie.png", name: "Billie Eilish" },
  { id: 3, img: "images/bts.png", name: "BTS" },
  { id: 4, img: "images/dragons.png", name: "Imagine Dragons" },
  { id: 5, img: "images/eminem.png", name: "Eminem" },
  { id: 6, img: "images/selena.png", name: "Selena Gomez" },
  { id: 7, img: "images/weeknd.png", name: "The Weeknd" },
  { id: 8, img: "images/1.png", name: "1" },
  { id: 9, img: "images/2.png", name: "2" },
  { id: 10, img: "images/3.png", name: "3" },
];

function TopArtists() {
  return (
    <div className="container">
      <h2 className="title">Top artists</h2>
      <div className="top-artists">
        {artists.map((artist) => (
          <div key={artist.id} className="artist">
            <img src={artist.img} alt={artist.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopArtists;
