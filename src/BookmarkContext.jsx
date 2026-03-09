import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Context
const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  // --- STATE 1: The Saved Papers ---
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("fyimp_saved_papers");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse bookmarks", error);
      return [];
    }
  });

  // --- STATE 2: The Homepage Preference ---
  const [isCustomHome, setIsCustomHome] = useState(() => {
    return localStorage.getItem("fyimp_custom_home") === "true";
  });

  // --- SYNCING TO LOCAL STORAGE ---
  // Whenever bookmarks change, save the new array to local storage
  useEffect(() => {
    localStorage.setItem("fyimp_saved_papers", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Whenever the homepage preference changes, save it to local storage
  useEffect(() => {
    localStorage.setItem("fyimp_custom_home", isCustomHome.toString());
  }, [isCustomHome]);

  // --- THE LOGIC: Toggle Bookmark ---
  const toggleBookmark = (paperObj) => {
    // 1. Check if it is already saved based on current state
    const isSaved = bookmarks.some((b) => b.paperId === paperObj.paperId);

    // 2. SAFETY CHECK: If adding a new paper, make sure we aren't at the limit!
    if (!isSaved && bookmarks.length >= 6) {
      alert("You can only save a maximum of 6 papers per semester.");
      return; // 🛑 Stop the function immediately! Do not update state.
    }

    // 3. Update the state (React loves this because it's a pure calculation now)
    setBookmarks((prev) => {
      if (isSaved) {
        // UN-BOOKMARK: Filter it out
        return prev.filter((b) => b.paperId !== paperObj.paperId);
      } else {
        // BOOKMARK: Add the new paper
        return [...prev, paperObj];
      }
    });
  };

  // --- THE LOGIC: Toggle Homepage ---
  const toggleCustomHome = () => {
    setIsCustomHome((prev) => !prev);
  };

  // Provide all of this to the rest of the app
  return (
    <BookmarkContext.Provider 
      value={{ 
        bookmarks, 
        toggleBookmark, 
        isCustomHome, 
        toggleCustomHome 
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

// Custom hook to use this context easily in any component
export const useBookmarks = () => useContext(BookmarkContext);
