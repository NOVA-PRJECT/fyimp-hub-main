import './App.css';
import NavBar from './components/NavBar';
import React from 'react';
import { useState } from 'react';

function App() {
  const [sidebar ,setsidebar] = useState(false);
  const [darkMode ,setdarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setdarkMode(!darkMode);
  }

  const toggleSidebar = () => {
    setsidebar(!sidebar);
  }
  return (
    <div>
      <NavBar toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
      <h1>THE WEBSITE IS UNDER CONSTRUCTION</h1>
    </div>
  );
}

export default App;
