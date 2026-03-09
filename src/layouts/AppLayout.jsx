import { Outlet, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect} from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import BottomNavBar from "../components/BottomNavBar";
import "../App.css";

function AppLayout() {
  /* -----------------------------
     GLOBAL UI STATE
  ------------------------------ */
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [about, setabout] = useState(false);

  /* -----------------------------
     DOMAIN STATE
  ------------------------------ */
  const [departments, setdepartments] = useState([]);
  const [selectedDept, setselectedDept] = useState(null);
  const [selectedSem, setselectedSem] = useState(1);
  const [papers, setpapers] = useState([]);
  const [deptid, setdeptid] = useState(0);
  const [selectedPaper, setselectedPaper] = useState("");
  const [paperid, setpaperid] = useState(0);
  const [activeTab, setactiveTab] = useState("notes");

  /* -----------------------------
     ROUTE GUARD STATE (IMPORTANT)
  ------------------------------ */
  const [isRouteValid, setIsRouteValid] = useState(true);

  /* -----------------------------
     HELPERS
  ------------------------------ */
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const backhome = () => {
    setselectedDept(null);
    setdeptid(0);
    setpapers([]);
    setselectedPaper("");
    setpaperid(0);
    setIsRouteValid(true);
  };

  /* -----------------------------
     ROUTE AWARE UI
  ------------------------------ */
  const location = useLocation();
  const isPaperRoute = location.pathname.includes("/paper/");
  
  // ✅ NEW: Detect if we are on the My Papers dashboard
  const isMyPapersRoute = location.pathname.includes("/mypapers");

  /* -----------------------------
     OUTLET CONTEXT
  ------------------------------ */
  const contextValue = useMemo(
    () => ({
      // domain
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

      // route guard
      isRouteValid,
      setIsRouteValid,
    }),
    [
      selectedDept,
      selectedSem,
      papers,
      deptid,
      selectedPaper,
      paperid,
      activeTab,
      isRouteValid,
    ]
  );

  return (
    <>
      {/* -----------------------------
         TOP NAV
      ------------------------------ */}
      <NavBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        selectedDept={selectedDept}
        setisSidebarOpen={setIsSidebarOpen}
        setselectedDept={setselectedDept}
        setselectedPaper={setselectedPaper}
        backhome={backhome}
      />

      {/* -----------------------------
         SIDE BAR
      ------------------------------ */}
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

      {/* -----------------------------
         PAGE CONTENT
      ------------------------------ */}
      <Outlet context={contextValue} />

      {/* -----------------------------
         BOTTOM NAV (GUARDED)
      ------------------------------ */}
      {/* ✅ NEW: Hide BottomNav if we are on a Paper route OR the My Papers route */}
      {!isPaperRoute && !isMyPapersRoute && isRouteValid && (
        <BottomNavBar
          setselectedSem={setselectedSem}
          setabout={setabout}
          about={about}
        />
      )}
    </>
  );
}

export default AppLayout;
