"use client";
import React, { useState } from 'react';

interface SearchComponentProps {
  onSearch: (searchTerm: string, filterOption: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');

  const handleSearch = () => {
    onSearch(searchTerm, filterOption);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <select
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value)}
      >
        <option value="all">All</option>
        <option value="highlights">Highlights</option>
        <option value="scoutUploads">Scout Uploads</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchComponent;