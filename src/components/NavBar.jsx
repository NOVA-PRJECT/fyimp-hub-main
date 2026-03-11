import { Menu, Brain, Search, Moon, Sun, Star } from "lucide-react"; 
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    const location = useLocation();
    const { bookmarks } = useBookmarks();

    // ✅ Check if we are currently on the My Papers dashboard
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
                    {/* ✅ THE BOOKMARK TOGGLE ICON */}
                    <div 
                      className="navIconWrapper" 
                      onClick={() => {
                        if (isMyPapersActive) {
                          // If we are already here, go Home and bypass the preference
                         // navigate('/', { state: { forceHome: true } }); 

navigate(-1,  {replace: true });
                        } else {
                          // Otherwise, open the dashboard
                          navigate('/mypapers');
                        }
                      }}
                    >
                        <Star 
                          className="searchIcon" 
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
