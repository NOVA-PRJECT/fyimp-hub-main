import { Menu, Brain, Search, Moon, Sun, Star, CircleQuestionMark } from "lucide-react"; 
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBookmarks } from "../BookmarkContext"; 
import { SEMESTERS } from "../constants.js";

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

    // Parse active department and semester from URL for the desktop navbar controls
    const pathParts = location.pathname.split('/').filter(Boolean);
    const deptParam = pathParts[0];
    const semParam = pathParts[1];
    
    const isDocViewRoute = deptParam && semParam && 
      !['search', 'about', 'mypapers'].includes(deptParam) &&
      !isNaN(Number(semParam));

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
                    {/* Semester Selector on Desktop */}
                    {isDocViewRoute && (
                      <select
                        className="navbar-semselect desktop-only"
                        value={semParam}
                        onChange={(e) => {
                          const nextSem = e.target.value;
                          localStorage.setItem("savedSemester", nextSem);
                          navigate(`/${deptParam}/${nextSem}`);
                        }}
                      >
                        {SEMESTERS.map((semOption) => (
                          <option key={semOption.id} value={semOption.id}>
                            {semOption.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* ✅ THE BOOKMARK TOGGLE ICON */}
                    <div 
                      className="navIconWrapper" 
                      onClick={() => {
                        if (isMyPapersActive) {
                          const fromPath = location.state?.from;
                          if (fromPath && fromPath !== '/') {
                            navigate(fromPath);
                          } else {
                            navigate('/', { state: { forceHome: true } });
                          }
                        } else {
                          // Otherwise, open the dashboard
                          navigate('/mypapers', { state: { from: location.pathname + location.search } });
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
                    
                    <CircleQuestionMark 
                      className="searchIcon desktop-only" 
                      onClick={() => navigate('/about')} 
                    />

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
