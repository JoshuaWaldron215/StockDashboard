import React, { useContext, useState } from 'react';
import axios from 'axios';
import { XCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchResults from './SearchResults';
import ThemeContext from '../context/ThemeContext';

const Search = ({ onStockSelect }) => {
  const [input, setInput] = useState('');
  const [bestMatches, setBestMatches] = useState([]);
  const { darkMode } = useContext(ThemeContext);

  const clear = () => {
    setInput('');
    setBestMatches([]);
  };

  const updateBestMatches = async () => {
    if (input) {
      const response = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=P67MZWEN1P5E5P7O`);
      setBestMatches(response.data.bestMatches);
    }
  };

  return (
    <div className={`flex items-center my-4 border-2 rounded-md relative z-50 w-96 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-neutral-200'}`}>
      <input
        type="text"
        value={input}
        className={`w-full px-4 py-2 focus:outline-none rounded-md ${darkMode ? 'bg-gray-900' : null}`}
        placeholder="Search stock..."
        onChange={(event) => setInput(event.target.value)}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            updateBestMatches();
          }
        }}
      />
      {input && (
        <button onClick={clear} className="m-1">
          <XCircleIcon className="h-4 w-4 fill-gray-500" />
        </button>
      )}
      <button onClick={updateBestMatches} className="h-8 w-8 bg-indigo-600 rounded-md flex justify-center items-center m-1 p-2">
        <MagnifyingGlassIcon className="h-4 w-4 fill-gray-100" />
      </button>
      {input && bestMatches.length > 0 ? (
        <SearchResults results={bestMatches} onStockSelect={onStockSelect} />
      ) : null}
    </div>
  );
};

export default Search;
