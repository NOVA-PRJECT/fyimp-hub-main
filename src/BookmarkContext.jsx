import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
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
    const isSaved = bookmarks.some((b) => b.paperId === paperObj.paperId);

    // 1. Check limit FIRST
    if (!isSaved && bookmarks.length >= 6) {
      toast.error("Maximum 6 papers allowed!");
      return; 
    }

    // 2. Fire the toast OUTSIDE the state setter (React only runs this once)
    if (isSaved) {
      toast.success("Removed from My Papers", { icon: '🗑️', id: 'remove-toast' });
    } else {
      toast.success("Added to My Papers", { icon: '⭐', id: 'add-toast' });
    }

    // 3. Keep the state update perfectly pure
    setBookmarks((prev) => {
      if (isSaved) {
        return prev.filter((b) => b.paperId !== paperObj.paperId);
      } else {
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
