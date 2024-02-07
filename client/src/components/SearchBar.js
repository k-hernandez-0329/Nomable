import React, { useState } from 'react';
import '../index.css'; // Import your CSS file

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // You can implement your search logic here
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
        className="search-bar"
      />
      
    </div>
  );
};

export default SearchBar;

