import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { StickyNote, Star } from "lucide-react"; // ✅ Import Star
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import { useBookmarks } from "../BookmarkContext"; // ✅ Import our Hook

const VALID_SEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function PaperView() {
  const { dept: deptCode, sem } = useParams();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  // ✅ Bring in the bookmarks!
  const { bookmarks, toggleBookmark } = useBookmarks();

  const {
    selectedDept,
    setselectedDept,
    setselectedSem,
    papers,
    setpapers,
    setdeptid,
    setselectedPaper,
    setpaperid,
    setIsRouteValid,
  } = useOutletContext();

  useEffect(() => {
    async function fetchData() {
      setloading(true);
      setIsRouteValid(true); 

      const semNumber = Number(sem);
      if (!VALID_SEMS.includes(semNumber)) {
        setIsRouteValid(false);
        setloading(false);
        return;
      }

      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .select("id, name")
        .eq("code", deptCode)
        .single();

      if (deptError || !deptData) {
        setIsRouteValid(false);   
        setpapers([]);
        setselectedDept(null);
        setdeptid(null);
        setloading(false);
        return;
      }

      setdeptid(deptData.id);
      setselectedDept(deptData.name);
      setselectedSem(semNumber);

      const { data: paperData, error: paperError } = await supabase
        .from("papers_ordered")
        .select("*")
        .eq("semester", semNumber) 
        .or(`department_id.eq.${deptData.id},type.eq.AEC`); 

      setpapers(paperError ? [] : paperData || []);
      setloading(false);
    }

    fetchData();
  }, [deptCode, sem]);

  if (!loading && !selectedDept) {
    return <NotFound title="Page not found" message="The page you are looking for doesn't exist." />;
  }

  return (
    <div className="paperview">
      {loading ? (
        <div className="loadingScreen">
          <div className="loader"></div>
          <p>Loading papers...</p>
        </div>
      ) : (
        <>
          <div className="pprhead">
            <h4>{selectedDept?.toUpperCase()}</h4>
            <h5>SEMESTER {sem}</h5>
          </div>

          {papers.length === 0 ? (
            <p className="nopapers">No papers available</p>
          ) : (
            <ul className="paperList">
              {papers.map((paper, index) => {
                const prevType = index > 0 ? papers[index - 1].type : null;
                const showHeading = paper.type !== prevType;
                
                // ✅ Check if THIS specific paper in the loop is saved
                const isSaved = bookmarks.some((b) => b.paperId === paper.id);

                return (
                  <React.Fragment key={paper.id}>
                    {showHeading && (
                      <li className="paperTypeHeading">{paper.type}</li>
                    )}

                    <li
                      className="paperItem"
                      onClick={() => {
                        setselectedPaper(paper.name);
                        setpaperid(paper.id);
                        navigate(`paper/${paper.id}/notes`);
                      }}
                    >
                      <div className="paperIcon">
                        <StickyNote size={28} />
                      </div>

                      <div className="paperDetails">
                        <div className="paperName">
                          {paper.name.toUpperCase()}
                        </div>
                        <div className="paperMeta">
                          {deptCode} • {paper.type}
                        </div>
                      </div>

                      {/* ✅ THE NEW STAR BUTTON */}
                      <div 
                        className="paperBookmark"
                        onClick={(e) => {
                          e.stopPropagation(); // 🛑 PREVENTS THE CARD FROM NAVIGATING!
                          toggleBookmark({
                            paperId: paper.id,
                            name: paper.name,
                            dept: deptCode,
                            sem: Number(sem)
                          });
                        }}
                      >
                        <Star 
                          size={24} 
                          fill={isSaved ? "#f59e0b" : "transparent"} 
                          color={isSaved ? "#f59e0b" : "var(--border-global)"} 
                          style={{ 
                            transition: "all 0.2s ease", 
                            filter: isSaved ? "drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))" : "none" 
                          }}
                        />
                      </div>
                    </li>
                  </React.Fragment>
                );
              })}
               <li className="endOfList">— End of Papers —</li>
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default PaperView;
