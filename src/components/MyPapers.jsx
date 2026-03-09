import React from "react";
import { useNavigate } from "react-router-dom";
import { StickyNote, StarOff } from "lucide-react";
import { useBookmarks } from "../BookmarkContext";

function MyPapers() {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark, isCustomHome, toggleCustomHome } = useBookmarks();

  return (
    <div className="paperview" style={{ zIndex: 2 }}>
      
      {/* Header & Toggle Switch */}
      <div className="pprhead" style={{ justifyContent: "space-between", paddingRight: "16px", marginTop: "1rem" }}>
        <div>
          <h4>MY PAPERS</h4>
        </div>

        {/* ✅ The "Set as Homepage" Toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-muted)", cursor: "pointer" }}>
          <span>Set as Home</span>
          <input 
            type="checkbox" 
            checked={isCustomHome} 
            onChange={toggleCustomHome}
            style={{ width: "16px", height: "16px", accentColor: "var(--brand-indigo)" }}
          />
        </label>
      </div>

      {/* The Paper List */}
      {bookmarks.length === 0 ? (
        <div className="nopapers" style={{ marginTop: "40px" }}>
          <StarOff size={40} color="var(--text-muted-alt)" style={{ marginBottom: "10px" }} />
          <p>You haven't saved any papers yet.</p>
          <p style={{ fontSize: "12px" }}>Tap the star icon on a paper to add it here!</p>
        </div>
      ) : (
        <ul className="paperList">
          {bookmarks.map((paper) => (
            <li
              key={paper.paperId}
              className="paperItem"
              onClick={() => navigate(`/${paper.dept}/${paper.sem}/paper/${paper.paperId}/notes`)}
            >
              <div className="paperIcon">
                <StickyNote size={28} />
              </div>

              <div className="paperDetails">
                <div className="paperName">{paper.name.toUpperCase()}</div>
                <div className="paperMeta">
                  {paper.dept.toUpperCase()} • SEM {paper.sem}
                </div>
              </div>

              {/* Remove Bookmark Button */}
              <div 
                className="paperBookmark"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents navigating when clicking remove
                  toggleBookmark(paper);
                }}
              >
                <StarOff size={20} color="var(--accent-rose)" />
              </div>
            </li>
          ))}
          <li className="endOfList">— {bookmarks.length}/6 Papers Saved —</li>
        </ul>
      )}
    </div>
  );
}

export default MyPapers;
