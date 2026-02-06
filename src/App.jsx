import './App.css';
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
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
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setdarkMode(!darkMode);
  }


  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Home */}
        <Route path="/" element={<HomeView />} />

        {/* Department + Semester */}
        <Route path=":dept/:sem" element={<PaperView />} />
      </Route>
    </Routes>
   
  );
}


export default App;
