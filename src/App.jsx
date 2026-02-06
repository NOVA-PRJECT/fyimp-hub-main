import './App.css';
import NavBar from './components/NavBar';
import React from 'react';
import { useState } from 'react';
import SideBar from './components/SideBar';
import BottomNavBar from './components/BottomNavBar'
import HomeView from './components/HomeView'
import PaperView from './components/PaperView'
import BottomResourceNav from './components/BottomResourceNav'
import ResourceView from './components/ResourceView'
import About from './components/About'


function App() {
  const [darkMode, setdarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [departments, setdepartments] = useState([])
  const [selectedDept, setselectedDept] = useState(null);
  const [selectedSem, setselectedSem] = useState(1);
  const [papers,setpapers] = useState([]);
  const [deptid,setdeptid] = useState(0)
  const [selectedPaper,setselectedPaper] = useState("");
  const [paperid,setpaperid]=useState(0);
  const [activeTab, setactiveTab] = useState("notes");
  const [about, setabout] = useState(false);
  
  const backhome =()=>{
    setselectedDept(null);
    setdeptid(0);
    setpaperid(0);
    setselectedPaper("");
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setdarkMode(!darkMode);
  }
   
   
   

  return (
    <div>
      <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}
        selectedDept={selectedDept} 
        setisSidebarOpen={setIsSidebarOpen}
        setselectedDept={setselectedDept} 
        setselectedPaper={setselectedPaper}
        backhome={backhome}/>
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} departments={departments} setdepartments={setdepartments}
        setselectedDept={setselectedDept} setdeptid={setdeptid} 
        selectedDept={selectedDept}
        setpaperid={setpaperid}/>
      {selectedDept === null ? (
        <HomeView />
      ) : (
        <PaperView selectedDept={selectedDept} selectedSem={selectedSem} setpapers={setpapers} papers={papers} deptid={deptid} setselectedPaper={setselectedPaper} setpaperid={setpaperid} />
      )}
      <BottomNavBar setselectedSem={setselectedSem} setabout={setabout} about={about}/>
      {about && (<About about={about} setabout={setabout}/>)}
      {paperid && (
      <>
      <BottomResourceNav activeTab={activeTab} setactiveTab={setactiveTab} />
      <ResourceView selectedDept={selectedDept} selectedSem={selectedSem} selectedPaper={selectedPaper} activeTab={activeTab} paperid={paperid}/> 
      </>
      )}
    </div>
  );
}

export default App;
