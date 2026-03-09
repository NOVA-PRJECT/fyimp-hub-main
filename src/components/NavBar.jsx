import { Menu, Brain, Search, Moon, Sun, Star } from "lucide-react"; 
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import useLocation
import { useBookmarks } from "../BookmarkContext"; 

function NavBar({ 
  darkMode, 
  setDarkMode,
  toggleSidebar,
  isSidebarOpen,
  selectedDept,
  setisSidebarOpen,
  setselectedDept,
  backhome
}) {
    const [searching, setsearching] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation(); // ✅ Get the current route
    const { bookmarks } = useBookmarks();

    // ✅ Check if we are currently on the My Papers page
    const isMyPapersActive = location.pathname.includes('/mypapers');

    const handleSearchClick = () => {
        setsearching(!searching);
    }
    
    return (
        <header className="header">
            <div className="navbar">
                <div className="leftNav">
                    <button onClick={toggleSidebar} className="menuBtn">
                        <Menu className="hamburgerIcon" />
                    </button>
                    <span onClick={() => {navigate('/');}} className="logoText" style={{ cursor: 'pointer' }}>
                        FYIMP H<Brain className="logoBrain" />B
                    </span>
                </div>
                
                <div className="rightNav">
                    {/* THE BOOKMARK ICON */}
                    <div 
                      className="navIconWrapper" 
                      onClick={() => navigate('/mypapers')}
                    >
                        <Star 
                          className="searchIcon" 
                          /* ✅ Dynamically fill with gold if active, otherwise transparent */
                          fill={isMyPapersActive ? "#f59e0b" : "transparent"} 
                          color={isMyPapersActive ? "#f59e0b" : "currentColor"} 
                          style={{ transition: "all 0.2s ease" }}
                        />
                        
                        {/* Notification Badge */}
                        {bookmarks.length > 0 && (
                          <span className="bookmarkBadge">
                            {bookmarks.length}
                          </span>
                        )}
                    </div>

                    <Search className="searchIcon" onClick={() => navigate('/search')} />
                    
                    {darkMode ? (
                        <Sun onClick={() => setDarkMode(!darkMode)} className="darkModeIcon" /> 
                    ) : (
                        <Moon onClick={() => setDarkMode(!darkMode)} className="darkModeIcon" />
                    )}
                </div>
            </div>
        </header>
    )
}

export default NavBar;
