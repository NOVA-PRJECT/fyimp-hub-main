import { Outlet } from "react-router-dom";
import { useState, useMemo } from "react"; // Added useMemo
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import BottomNavBar from "../components/BottomNavBar";
import '../App.css'

function AppLayout() {
  const [darkMode, setdarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [departments, setdepartments] = useState([]);
  const [selectedDept, setselectedDept] = useState(null);
  const [selectedSem, setselectedSem] = useState(1);
  const [papers, setpapers] = useState([]);
  const [deptid, setdeptid] = useState(0);
  const [selectedPaper, setselectedPaper] = useState("");
  const [paperid, setpaperid] = useState(0);
  const [activeTab, setactiveTab] = useState("notes");
  const [about, setabout] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setdarkMode(!darkMode);

  const backhome = () => {
    setselectedDept(null);
    setdeptid(0);
  };

  // Memoize the context to prevent unnecessary re-renders in child routes
  const contextValue = useMemo(() => ({
    selectedDept,
    setselectedDept,
    selectedSem,
    setselectedSem,
    papers,
    setpapers,
    deptid,
    setdeptid,
    selectedPaper,
    setselectedPaper,
    paperid,
    setpaperid,
    activeTab,
    setactiveTab,
  }), [selectedDept, selectedSem, papers, deptid, selectedPaper, paperid, activeTab]);

  return (
    <>
      <NavBar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        selectedDept={selectedDept}
        setIsSidebarOpen={setIsSidebarOpen}
        setselectedDept={setselectedDept}
        setselectedPaper={setselectedPaper}
        backhome={backhome}
      />

      <SideBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        departments={departments}
        setdepartments={setdepartments}
        setselectedDept={setselectedDept}
        setdeptid={setdeptid}
        selectedDept={selectedDept}
        setpaperid={setpaperid}
      />

      <Outlet context={contextValue} />

      <BottomNavBar
        setselectedSem={setselectedSem}
        setabout={setabout}
        about={about}
      />
    </>
  );
}

export default AppLayout;
