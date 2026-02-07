import { Menu, Brain, Search, Moon, Sun } from "lucide-react"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavBar({ darkMode,
  toggleDarkMode,
  toggleSidebar,
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
            <header className="header">
                {searching ? (
                    <div className="searchInput">
                        <input type="text" className="inputBar" placeholder="Search from all papers..." />
                        <button onClick={handleSearchClick} className="closeSearchBtn">
                            X
                        </button>
                    </div>
                ) : (
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
                            {darkMode ? <Sun onClick={toggleDarkMode} className="darkModeIcon" /> : <Moon onClick={toggleDarkMode} className="darkModeIcon" />
                            }
                        </div>
                    </div>
                )}
            </header>
        </header>

    )

}
export default NavBar;