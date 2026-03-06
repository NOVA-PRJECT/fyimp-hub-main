import { Menu, Brain, Search, Moon, Sun } from "lucide-react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavBar({ darkMode, setDarkMode,toggleSidebar,
  isSidebarOpen,
  selectedDept,
  setisSidebarOpen,
  setselectedDept,
  backhome}) {
    const [searching, setsearching] = useState(false);

    const handleSearchClick = () => {
        setsearching(!searching);
    }
    
    
    const navigate = useNavigate();
    
    return (
            <header className="header">
               
                    <div className="navbar">
                        <div className="leftNav">
                            <button onClick={toggleSidebar} className="menuBtn">
                                <Menu onClick={toggleSidebar} className="hamburgerIcon" />
                            </button>
                            <span onClick={() => {navigate('/');}} className="logoText">
                                FYIMP H<Brain className="logoBrain" />B
                            </span>
                        </div>
                        <div className="rightNav">
                            <Search onClick={()=>{handleSearchClick();setisSidebarOpen(false);}}  className="searchIcon" />
                            {darkMode ? <Sun onClick={() => setDarkMode(!darkMode)} className="darkModeIcon" /> : <Moon onClick={() => setDarkMode(!darkMode)}
                            className="darkModeIcon" />
                            }
                        </div>
                    </div>
            </header>

    )

}
export default NavBar;