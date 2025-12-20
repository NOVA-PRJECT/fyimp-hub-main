import './App.css';
import NavBar from './components/NavBar';
import React from 'react';
import { useState } from 'react';
import SideBar from './components/SideBar';
import BottomNavBar from './components/BottomNavBar'
function App() {
  const [darkMode ,setdarkMode] = useState(false);
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [departments,setdepartments] =useState([])
      const[selectedDept, setselectedDept] = useState("none");
      const [selectedSem,setselectedSem] =useState(0);

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
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} departments={departments} setdepartments={setdepartments}
      setselectedDept={setselectedDept}/>
      <h1>THE WEBSITE IS UNDER CONSTRUCTION</h1>
      <h4>Selected department : {selectedDept}</h4>
       <h4>Selected Semester : {selectedSem}</h4>
      <BottomNavBar setselectedSem={setselectedSem}/>
    </div>
  );
}

export default App;
