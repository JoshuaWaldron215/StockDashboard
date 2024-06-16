import React, { useState } from 'react';
import axios from 'axios';
import SearchResults from './SearchResults';

const API_KEY = 'cpn41s1r01qtggbae8v0cpn41s1r01qtggbae8vg';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`);
      if (response.data.result) {
        setResults(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  const handleSelect = (symbol) => {
    onSearch(symbol);
    setResults([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Search for a stock symbol..."
        />
        <button type="submit" className="hidden">Search</button>
      </form>
      {results.length > 0 && <SearchResults results={results} onSelect={handleSelect} />}
    </div>
  );
};

export default Search;
