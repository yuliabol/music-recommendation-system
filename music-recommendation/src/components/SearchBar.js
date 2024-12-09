import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar({ data, onSelect }) {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleInputChange = (e) => {
  const input = e.target.value;
  setQuery(input);

  if (input) {
    const results = data.filter((item) => {
      const artistsMatch = item.artists && item.artists.toLowerCase().includes(input.toLowerCase());
      const trackMatch = item.track_name && item.track_name.toLowerCase().includes(input.toLowerCase());
      return artistsMatch || trackMatch;
    });
    setFilteredResults(results);
  } else {
    setFilteredResults([]);
  }
};


  const handleResultClick = (result) => {
    onSelect(result); // input parsing
    setQuery(result.artists); 
    setFilteredResults([]); // clear results
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by song or artist..."
        value={query}
        onChange={handleInputChange}
        className="search-input"
      />
      {filteredResults.length > 0 && (
        <ul className="autocomplete-results">
          {filteredResults.map((result) => (
            <li
              key={result.id}
              onClick={() => handleResultClick(result)}
              className="autocomplete-item"
            >
              {result.artists} - {result.track_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
