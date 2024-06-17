import './App.css';
import Dashboard from './components/Dashboard';
import { useState } from 'react';
import ThemeContext from './context/ThemeContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}

export default App;