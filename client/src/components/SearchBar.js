import React, { useState } from "react";
import "../index.css";

const SearchBar = ({ setSearchTerm }) => {
  const [searchTerm, setSearchTermLocal] = useState("");

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTermLocal(term); // Update local state
    setSearchTerm(term); // Pass the search term to the parent component
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search"
        className="search-bar"
      />
    </div>
  );
};

export default SearchBar;
