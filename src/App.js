
import './App.css';
import Dashboard from './components/Dashboard';
import { useCallback, useState } from 'react';
import ThemeContext from './context/ThemeContext';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [stockSymbol, setStockSymbol] = useState("FB");
  return (
  <ThemeContext.Provider value={{darkMode,setDarkMode}}>
    <Dashboard />
  </ThemeContext.Provider> 
  );
}

export default App;
