import './App.css';
import NavBar from './components/NavBar';
import React from 'react';
import { useState } from 'react';
import SideBar from './components/SideBar';
import BottomNavBar from './components/BottomNavBar'
import HomeView from './components/HomeView'
import PaperView from './components/PaperView'
function App() {
  const [darkMode, setdarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [departments, setdepartments] = useState([])
  const [selectedDept, setselectedDept] = useState(null);
  const [selectedSem, setselectedSem] = useState(1);
  const [papers,setpapers] = useState([]);
  const [deptid,setdeptid] = useState(0)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setdarkMode(!darkMode);
  }


  return (
    <div>
      <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}
        setisSidebarOpen={setIsSidebarOpen}
        setselectedDept={setselectedDept} />
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} departments={departments} setdepartments={setdepartments}
        setselectedDept={setselectedDept} setdeptid={setdeptid} />
      {selectedDept === null ? (
        <HomeView />
      ) : (
        <PaperView selectedDept={selectedDept} selectedSem={selectedSem} setpapers={setpapers} papers={papers} deptid={deptid}/>
      )}
      <BottomNavBar setselectedSem={setselectedSem} />
    </div>
  );
}

export default App;
