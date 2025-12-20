import './App.css';
import NavBar from './components/NavBar';
import React from 'react';
import { useState } from 'react';
import SideBar from './components/SideBar';

function App() {
  const [darkMode ,setdarkMode] = useState(false);
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [departments,setdepartments] =useState([])

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
  
  const toggleDarkMode = () => {
    setdarkMode(!darkMode);
  }
  
  return (
    <div>
      <NavBar  darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}
      setisSidebarOpen={setIsSidebarOpen}/>
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} departments={departments} setdepartments={setdepartments}/>
      <h1>THE WEBSITE IS UNDER CONSTRUCTION</h1>
    </div>
  );
}

export default App;
