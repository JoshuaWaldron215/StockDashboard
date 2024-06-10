import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import { useCallback, useState } from 'react';
import ThemeContext from './context/ThemeContext';
import { Database } from 'heroicons-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
  <ThemeContext.Provider value={{darkMode,setDarkMode}}>
    <Dashboard />
  </ThemeContext.Provider> 
  );
}

export default App;
